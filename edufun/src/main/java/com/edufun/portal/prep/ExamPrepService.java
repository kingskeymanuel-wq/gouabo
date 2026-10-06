package com.edufun.portal.prep;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Contenu de la Prépa Examens (CEPE, BEPC, BAC), lu depuis src/main/resources/exams/<examen>/*.md.
 *
 * Un fichier « examen.md » décrit l'examen (présentation, FAQ). Les autres fichiers décrivent une
 * matière : sections « # Méthode », « # Sujet … » (avec « ## Corrigé ») et « # QCM ».
 */
@Service
public class ExamPrepService {
    private static final Logger log = LoggerFactory.getLogger(ExamPrepService.class);
    public static final List<String> EXAMS = List.of("cepe", "bepc", "bac");

    public record Faq(String question, String answer) {}
    public record Sujet(String title, String statement, String correction) {}
    public record Subject(String slug, String name, String duration, String series, String method, List<Sujet> sujets, String qcm) {}
    public record Exam(String code, String name, String fullName, String level, String intro, List<Faq> faq, List<Subject> subjects) {}

    private final Map<String, Exam> exams = new LinkedHashMap<>();

    @PostConstruct
    public void load() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        for (String code : EXAMS) {
            Resource[] files = resolver.getResources("classpath*:exams/" + code + "/*.md");
            Arrays.sort(files, Comparator.comparing(r -> String.valueOf(r.getFilename())));
            Map<String, String> meta = Map.of();
            String intro = "";
            List<Faq> faq = new ArrayList<>();
            List<Subject> subjects = new ArrayList<>();
            Map<String, Integer> order = new HashMap<>();
            for (Resource r : files) {
                String text = read(r);
                Map<String, String> m = meta(text);
                String body = stripMeta(text);
                if ("examen.md".equals(r.getFilename())) {
                    meta = m;
                    intro = section(body, "Présentation");
                    faq = faq(section(body, "FAQ"));
                } else {
                    String slug = Objects.requireNonNull(r.getFilename()).replace(".md", "");
                    order.put(slug, Integer.parseInt(m.getOrDefault("order", "99")));
                    subjects.add(new Subject(slug, m.getOrDefault("subject", slug), m.getOrDefault("duration", ""), m.getOrDefault("series", ""),
                            section(body, "Méthode"), sujets(body), section(body, "QCM")));
                }
            }
            if (meta.isEmpty()) continue;
            subjects.sort(Comparator.comparingInt((Subject x) -> order.getOrDefault(x.slug(), 99)));
            exams.put(code, new Exam(code, meta.get("name"), meta.get("fullName"), meta.get("level"), intro, faq, subjects));
        }
        log.info("Prépa examens chargée : {}", exams.values().stream().map(e -> e.name() + " (" + e.subjects().size() + " matières)").toList());
    }

    public Collection<Exam> all() { return exams.values(); }
    public Optional<Exam> exam(String code) { return Optional.ofNullable(exams.get(code)); }

    private static String read(Resource r) throws IOException {
        try (InputStream in = r.getInputStream()) { return new String(in.readAllBytes(), StandardCharsets.UTF_8).replace("\r", ""); }
    }

    private static Map<String, String> meta(String text) {
        Map<String, String> out = new HashMap<>();
        if (!text.startsWith("---\n")) return out;
        int end = text.indexOf("\n---", 4);
        for (String line : text.substring(4, end).split("\n")) {
            int c = line.indexOf(':');
            if (c > 0) out.put(line.substring(0, c).trim(), line.substring(c + 1).trim());
        }
        return out;
    }

    private static String stripMeta(String text) {
        if (!text.startsWith("---\n")) return text;
        int end = text.indexOf("\n---", 4);
        return text.substring(text.indexOf('\n', end + 1) + 1);
    }

    /** Contenu d'une section « # Titre » (jusqu'à la section suivante de même niveau). */
    private static String section(String body, String title) {
        String[] lines = body.split("\n");
        StringBuilder out = new StringBuilder();
        boolean in = false;
        for (String line : lines) {
            if (line.startsWith("# ")) { in = line.substring(2).trim().equalsIgnoreCase(title); continue; }
            if (in) out.append(line).append('\n');
        }
        return out.toString().trim();
    }

    private static List<Sujet> sujets(String body) {
        List<Sujet> out = new ArrayList<>();
        String title = null;
        StringBuilder statement = new StringBuilder(), correction = new StringBuilder();
        boolean inCorrection = false;
        for (String line : (body + "\n# FIN").split("\n")) {
            if (line.startsWith("# ")) {
                if (title != null) out.add(new Sujet(title, statement.toString().trim(), correction.toString().trim()));
                title = line.substring(2).trim().startsWith("Sujet") ? line.substring(2).trim() : null;
                statement.setLength(0); correction.setLength(0); inCorrection = false;
                continue;
            }
            if (title == null) continue;
            if (line.startsWith("## Corrigé")) { inCorrection = true; continue; }
            (inCorrection ? correction : statement).append(line).append('\n');
        }
        return out;
    }

    private static List<Faq> faq(String text) {
        List<Faq> out = new ArrayList<>();
        String q = null;
        StringBuilder a = new StringBuilder();
        for (String line : (text + "\n## FIN").split("\n")) {
            if (line.startsWith("## ")) {
                if (q != null) out.add(new Faq(q, a.toString().trim()));
                q = line.substring(3).trim(); a.setLength(0);
                continue;
            }
            if (q != null) a.append(line).append('\n');
        }
        return out;
    }
}
