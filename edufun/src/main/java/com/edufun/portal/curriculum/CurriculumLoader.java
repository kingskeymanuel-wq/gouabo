package com.edufun.portal.curriculum;

import com.edufun.portal.model.Lesson;
import com.edufun.portal.model.Student;
import com.edufun.portal.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Charge le curriculum officiel depuis src/main/resources/curriculum/**.md et le synchronise avec la base.
 *
 * Format d'un fichier (une discipline d'une classe) :
 * <pre>
 * ---
 * level: CP1
 * subject: Français
 * ---
 * # Titre du chapitre (compétence / thème)
 * ## CODE | Titre de la leçon | 30 min
 * Objectif : ce que l'élève saura faire.
 * ### Titre de section
 * Texte de la section (une ligne = un paragraphe ; « - » = puce).
 * </pre>
 *
 * Les leçons sont identifiées par leur CODE : une mise à jour du fichier modifie la leçon existante
 * sans changer son identifiant, ce qui préserve la progression des élèves.
 */
@Service
public class CurriculumLoader {
    private static final Logger log = LoggerFactory.getLogger(CurriculumLoader.class);
    /** Marqueur des anciennes leçons génériques (V3 → V9) à remplacer. */
    private static final String LEGACY_MARKER = "MINI-DÉFI EDUFUN";

    private final LessonRepository lessons;
    private final LessonProgressRepository progress;
    private final VideoResourceRepository videos;
    private final StudentRepository students;

    public CurriculumLoader(LessonRepository lessons, LessonProgressRepository progress, VideoResourceRepository videos, StudentRepository students) {
        this.lessons = lessons; this.progress = progress; this.videos = videos; this.students = students;
    }

    public record ParsedLesson(String code, String level, String subject, String chapter, String title, String duration, String objective, String content) {}

    @Transactional
    public void sync() throws IOException {
        migrateStudentLevels();
        removeLegacyLessons();

        List<ParsedLesson> parsed = new ArrayList<>();
        Resource[] files = new PathMatchingResourcePatternResolver().getResources("classpath*:curriculum/**/*.md");
        // Ordre déterministe : une discipline répartie sur plusieurs fichiers garde toujours le même ordre.
        Arrays.sort(files, Comparator.comparing(r -> { try { return r.getURL().toString(); } catch (IOException e) { return String.valueOf(r.getFilename()); } }));
        for (Resource r : files) {
            try (InputStream in = r.getInputStream()) {
                parsed.addAll(parse(new String(in.readAllBytes(), StandardCharsets.UTF_8), r.getFilename()));
            }
        }

        Set<String> seen = new HashSet<>();
        Map<String, Integer> counters = new HashMap<>();
        int created = 0, updated = 0;
        for (ParsedLesson p : parsed) {
            if (!seen.add(p.code())) throw new IllegalStateException("Code de leçon en double : " + p.code());
            int n = counters.merge(p.level() + "|" + p.subject(), 1, Integer::sum);
            Lesson l = lessons.findByCode(p.code()).orElse(null);
            if (l == null) { l = new Lesson(); l.setCode(p.code()); created++; } else updated++;
            l.setLevel(p.level()); l.setSubject(p.subject()); l.setChapter(p.chapter()); l.setTitle(p.title());
            l.setDuration(p.duration()); l.setObjective(p.objective()); l.setContent(p.content());
            l.setOrderIndex(Levels.subjectRank(p.level(), p.subject()) * 1000 + n);
            l.setStatus("PUBLISHED");
            lessons.save(l);
        }

        // Leçons retirées des fichiers : supprimées si aucun élève ne les a suivies, sinon archivées.
        int archived = 0;
        for (Lesson l : lessons.findAll()) {
            if (l.getCode() == null || seen.contains(l.getCode())) continue;
            if (progress.countByLessonId(l.getId()) == 0) { videos.deleteByLessonIdIn(List.of(l.getId())); lessons.delete(l); }
            else { l.setStatus("ARCHIVED"); lessons.save(l); }
            archived++;
        }
        log.info("Curriculum synchronisé : {} fichiers, {} leçons créées, {} mises à jour, {} retirées", files.length, created, updated, archived);
    }

    private void migrateStudentLevels() {
        for (Student s : students.findAll()) {
            String migrated = Levels.migrate(s.getLevel());
            if (!Objects.equals(migrated, s.getLevel())) { s.setLevel(migrated); students.save(s); }
        }
    }

    private void removeLegacyLessons() {
        List<Lesson> legacy = lessons.findByCodeIsNullAndContentContaining(LEGACY_MARKER);
        if (legacy.isEmpty()) return;
        List<Long> ids = legacy.stream().map(Lesson::getId).toList();
        progress.deleteByLessonIdIn(ids);
        videos.deleteByLessonIdIn(ids);
        lessons.deleteAll(legacy);
        log.info("{} anciennes leçons génériques remplacées par le curriculum officiel", ids.size());
    }

    static List<ParsedLesson> parse(String text, String fileName) {
        String[] lines = text.replace("\r", "").split("\n");
        Map<String, String> meta = new HashMap<>();
        int i = 0;
        if (lines.length > 0 && lines[0].trim().equals("---")) {
            for (i = 1; i < lines.length && !lines[i].trim().equals("---"); i++) {
                int c = lines[i].indexOf(':');
                if (c > 0) meta.put(lines[i].substring(0, c).trim(), lines[i].substring(c + 1).trim());
            }
            i++;
        }
        String subject = meta.get("subject");
        if (subject == null || subject.isBlank()) throw new IllegalStateException(fileName + " : discipline manquante");
        // « levels: Première A, Première C » : un même programme partagé par plusieurs séries.
        if (meta.containsKey("levels")) {
            List<ParsedLesson> all = new ArrayList<>();
            for (String lv : meta.get("levels").split(",")) {
                String level = lv.trim();
                String suffix = level.substring(level.lastIndexOf(' ') + 1);
                for (ParsedLesson p : parseBody(lines, i, level, subject, fileName))
                    all.add(new ParsedLesson(p.code() + "-" + suffix, level, subject, p.chapter(), p.title(), p.duration(), p.objective(), p.content()));
            }
            return all;
        }
        return parseBody(lines, i, meta.get("level"), subject, fileName);
    }

    private static List<ParsedLesson> parseBody(String[] lines, int start, String level, String subject, String fileName) {
        if (!Levels.exists(level)) throw new IllegalStateException(fileName + " : classe inconnue « " + level + " »");
        int i = start;

        List<ParsedLesson> out = new ArrayList<>();
        String chapter = null;
        String[] head = null;
        String objective = null;
        StringBuilder content = new StringBuilder();
        String sectionTitle = null;
        StringBuilder section = new StringBuilder();
        for (; i <= lines.length; i++) {
            String line = i < lines.length ? lines[i].stripTrailing() : "## END";
            boolean newLesson = line.startsWith("## ");
            boolean newChapter = line.startsWith("# ");
            if ((newLesson || newChapter || line.startsWith("### ")) && sectionTitle != null) {
                appendSection(content, sectionTitle, section);
                sectionTitle = null; section.setLength(0);
            }
            if ((newLesson || newChapter) && head != null) {
                if (chapter == null) throw new IllegalStateException(fileName + " : leçon " + head[0] + " hors chapitre");
                out.add(new ParsedLesson(head[0], level, subject, chapter, head[1], head[2], objective, content.toString()));
                head = null; objective = null; content.setLength(0);
            }
            if (i == lines.length) break;
            if (newChapter) { chapter = line.substring(2).trim(); continue; }
            if (newLesson) {
                String[] parts = line.substring(3).split("\\|");
                if (parts.length < 2) throw new IllegalStateException(fileName + " : en-tête de leçon invalide « " + line + " »");
                head = new String[]{parts[0].trim(), parts[1].trim(), parts.length > 2 ? parts[2].trim() : "30 min"};
                continue;
            }
            if (head == null) continue;
            if (line.startsWith("### ")) { sectionTitle = line.substring(4).trim(); continue; }
            if (sectionTitle == null) {
                if (line.startsWith("Objectif :")) objective = line.substring("Objectif :".length()).trim();
                continue;
            }
            if (!line.isBlank()) { if (section.length() > 0) section.append('\n'); section.append(line.trim()); }
        }
        return out;
    }

    private static void appendSection(StringBuilder content, String title, StringBuilder body) {
        if (content.length() > 0) content.append("\n\n");
        content.append(title);
        if (body.length() > 0) content.append('\n').append(body);
    }
}
