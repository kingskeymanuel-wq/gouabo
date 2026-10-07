package com.edufun.portal;

import com.edufun.portal.model.*;
import com.edufun.portal.repository.*;
import com.edufun.portal.curriculum.Levels;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    private static final String PHOTO = "/vendor/images/";

    @Bean
    CommandLineRunner seed(CourseRepository courses, LessonRepository lessons, VideoResourceRepository videos,
                           BadgeRepository badges, CurriculumVersionRepository versions, QuizRepository quizzes,
                           QuizQuestionRepository questions, UserAccountRepository accounts, StudentRepository students, PasswordEncoder encoder,
                           com.edufun.portal.curriculum.CurriculumLoader curriculum) {
        return args -> {
            // Le curriculum officiel (fichiers curriculum/**.md) remplace les anciennes leçons génériques.
            // Les leçons créées par l'administration sont conservées.
            curriculum.sync();
            if (courses.count() < 50) seedCourses(courses);
            if (badges.count() == 0) seedBadges(badges);
            if (versions.count() == 0) seedVersions(versions);
            if (quizzes.count() == 0) seedQuizzes(quizzes, questions);
            seedAdmin(accounts, encoder);
        };
    }

    private void seedCourses(CourseRepository r) {
        for (Levels.Level level : Levels.all()) {
            for (String subject : level.subjects()) {
                addCourse(r, "Parcours complet — " + subject + " • " + level.code(), level.code(), subject, "Parcours", PHOTO + "pexels-8152734.jpg",
                        "Leçons conformes au programme éducatif ivoirien, avec exemples, exercices et corrigés.",
                        (Levels.LYCEE.equals(level.cycle()) || Levels.LYCEE_TECHNIQUE.equals(level.cycle())) ? "Avancé" : "Progressif", "Toute l'année");
            }
        }
    }

    // Compte administrateur initial : à définir en production avec EDUFUN_ADMIN_EMAIL et EDUFUN_ADMIN_PASSWORD,
    // puis à changer depuis la console. Il n'est créé qu'une fois et n'est jamais réinitialisé.
    @org.springframework.beans.factory.annotation.Value("${edufun.admin.email:admin@edufun.ci}") private String adminEmail;
    @org.springframework.beans.factory.annotation.Value("${edufun.admin.password:EduFun@2026}") private String adminPassword;

    private void seedAdmin(UserAccountRepository accounts, PasswordEncoder encoder) {
        String email = adminEmail.trim().toLowerCase();
        if (accounts.findByEmailIgnoreCase(email).isEmpty()) {
            UserAccount a = new UserAccount();
            a.setEmail(email); a.setPasswordHash(encoder.encode(adminPassword)); a.setRole("ADMIN"); a.setEnabled(true);
            accounts.save(a);
        }
    }

    private void seedBadges(BadgeRepository r){ addBadge(r,"START","Premier pas","Terminer tes premières activités.","🚀",20); addBadge(r,"SCHOLAR","Apprenant régulier","Atteindre 100 XP.","📚",100); addBadge(r,"EXPERT","Expert EduFun","Atteindre 500 XP.","🏆",500); addBadge(r,"QUIZ_MASTER","Maître des quiz","Atteindre 1000 XP.","🧠",1000); }
    private void addBadge(BadgeRepository r,String code,String name,String desc,String icon,int xp){Badge b=new Badge();b.setCode(code);b.setName(name);b.setDescription(desc);b.setIcon(icon);b.setXpRequired(xp);r.save(b);}
    private void seedVersions(CurriculumVersionRepository r){
        CurriculumVersion v=new CurriculumVersion();v.setAcademicYear("2026-2027");v.setLabel("Référentiel EduFun — suivi des textes officiels DPFC");v.setSourceUrl("https://dpfc-ci.net/?page_id=4855");v.setExperimental(false);v.setStatus("ACTIVE");r.save(v);
        CurriculumVersion e=new CurriculumVersion();e.setAcademicYear("2025-2026");e.setLabel("Programmes révisés en expérimentation : CP1, CP2 et 6e dans les établissements pilotes");e.setSourceUrl("https://dpfc-ci.net/dpfc/2026/textes_officiels/mena/1/Circulaire%20N%C2%B0%200305_%20Exp%C3%A9rimentation%20des%20nouveaux%20programmes%20%C3%A9ducatifs.pdf");e.setExperimental(true);e.setStatus("REFERENCE");r.save(e);
    }
    private void seedQuizzes(QuizRepository qr, QuizQuestionRepository qq){Quiz q=new Quiz();q.setTitle("Mini-quiz : premiers pas sur le Web");q.setLevel("6e");q.setSubject("Informatique");q.setPassingScore(50);q.setPublished(true);q=qr.save(q);addQuestion(qq,q.getId(),"QCM","Quel langage structure une page web ?","HTML|CSS|JavaScript","HTML",1,1);addQuestion(qq,q.getId(),"VRAI_FAUX","Le CSS sert principalement à présenter et styliser une page.","Vrai|Faux","Vrai",1,2);addQuestion(qq,q.getId(),"QCM","Quel langage permet d'ajouter des interactions dans le navigateur ?","HTML|CSS|JavaScript","JavaScript",1,3);}
    private void addQuestion(QuizQuestionRepository r,Long quizId,String type,String q,String options,String answer,int points,int order){QuizQuestion x=new QuizQuestion();x.setQuizId(quizId);x.setType(type);x.setQuestion(q);x.setOptions(options);x.setCorrectAnswer(answer);x.setPoints(points);x.setOrderIndex(order);r.save(x);}
    private void addCourse(CourseRepository r,String title,String level,String subject,String type,String image,String description,String difficulty,String duration){Course c=new Course();c.setTitle(title);c.setLevel(level);c.setSubject(subject);c.setType(type);c.setStatus("PUBLISHED");c.setCoverImage(image);c.setDescription(description);c.setDifficulty(difficulty);c.setDuration(duration);c.setContent(description);r.save(c);}
    private Lesson lesson(LessonRepository r,String level,String subject,String chapter,String title,int order,String objective,String content){Lesson l=new Lesson();l.setLevel(level);l.setSubject(subject);l.setChapter(chapter);l.setTitle(title);l.setOrderIndex(order);l.setStatus("PUBLISHED");l.setDuration("30 min");l.setObjective(objective);l.setContent(content);return r.save(l);}

}
