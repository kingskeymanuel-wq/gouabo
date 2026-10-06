package com.edufun.portal;

import com.edufun.portal.model.*;
import com.edufun.portal.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    private static final String PHOTO = "/vendor/images/";
    private static final List<String> LEVELS = List.of("CP1","CP2","CE1","CE2","CM1","CM2","6e","5e","4e","3e","2nde","Première","Terminale");

    @Bean
    CommandLineRunner seed(CourseRepository courses, LessonRepository lessons, VideoResourceRepository videos,
                           BadgeRepository badges, CurriculumVersionRepository versions, QuizRepository quizzes,
                           QuizQuestionRepository questions, UserAccountRepository accounts, StudentRepository students, PasswordEncoder encoder) {
        return args -> {
            // The previous versions contained progression placeholders. Replace those demo lessons once with the
            // full pedagogical seed below. After the rich seed is installed, admin-created lessons are preserved.
            if (lessons.count() < 700) {
                lessons.deleteAll();
                seedRichCurriculum(lessons, videos);
            }
            if (courses.count() < 50) seedCourses(courses);
            if (badges.count() == 0) seedBadges(badges);
            if (versions.count() == 0) seedVersions(versions);
            if (quizzes.count() == 0) seedQuizzes(quizzes, questions);
            seedAdmin(accounts, encoder);
        };
    }

    private void seedCourses(CourseRepository r) {
        Map<String,List<String>> subjects = subjectMap();
        for (String level : LEVELS) {
            for (String subject : subjectsFor(level, subjects)) {
                String title = "Parcours complet — " + subject + " • " + level;
                String image = subject.equals("Développement Web") || subject.equals("Informatique") ? PHOTO+"pexels-12903122.jpg" : PHOTO+"pexels-8152734.jpg";
                addCourse(r,title,level,subject,"Parcours",image,
                        "Cours progressif avec notions, exemples, activités, exercices corrigés, quiz et révisions.",
                        level.equals("Terminale") || level.equals("Première") ? "Avancé" : "Progressif", "8 à 12 séances");
            }
        }
    }

    private void seedRichCurriculum(LessonRepository r, VideoResourceRepository videos) {
        Map<String,List<String>> subjects = subjectMap();
        for (String level : LEVELS) {
            int order = 1;
            for (String subject : subjectsFor(level, subjects)) {
                List<Module> modules = modulesFor(subject, level);
                int chapter = 1;
                for (Module m : modules) {
                    Lesson l = lesson(r, level, subject, "Séquence " + chapter + " — " + m.title,
                            m.title, order++, m.objective, buildContent(level, subject, m));
                    // A few lessons get an illustrative video placeholder URL that the admin can replace.
                    if (chapter <= 2 && (subject.equals("Anglais") || subject.equals("Informatique") || subject.equals("Développement Web"))) {
                        VideoResource v = new VideoResource();
                        v.setLessonId(l.getId()); v.setTitle("Capsule vidéo — " + m.title); v.setType("EXTERNE");
                        v.setUrl("https://www.youtube.com/results?search_query=" + enc("EduFun " + level + " " + subject + " " + m.title));
                        v.setPublished(true); videos.save(v);
                    }
                    chapter++;
                }
            }
        }
    }

    private String buildContent(String level, String subject, Module m) {
        return "OBJECTIF\n" + m.objective +
                "\n\n1. JE DÉCOUVRE\n" + m.discovery +
                "\n\n2. JE RETIENS\n" + m.knowledge +
                "\n\n3. EXEMPLES GUIDÉS\n" + m.examples +
                "\n\n4. JE PRATIQUE\n" + m.practice +
                "\n\n5. JE ME CORRIGE\n" + m.correction +
                "\n\n6. MINI-DÉFI EDUFUN\nExplique la notion avec tes propres mots, réalise l'activité sans regarder la correction, puis vérifie chaque étape. Gagne de l'XP lorsque la leçon est terminée.\n\nNiveau : " + level + " • Matière : " + subject;
    }

    private List<String> subjectsFor(String level, Map<String,List<String>> map) {
        if (List.of("CP1","CP2","CE1","CE2","CM1","CM2").contains(level)) return map.get("Primaire");
        if (List.of("6e","5e","4e","3e").contains(level)) return map.get("Collège");
        return map.get("Lycée");
    }

    private Map<String,List<String>> subjectMap() {
        Map<String,List<String>> m = new LinkedHashMap<>();
        m.put("Primaire", List.of("Français","Mathématiques","Anglais","Sciences","Histoire-Géographie","EDHC","EPS","Arts"));
        m.put("Collège", List.of("Français","Mathématiques","Anglais","SVT","Physique-Chimie","Histoire-Géographie","EDHC","EPS","Arts Plastiques","Éducation Musicale","Informatique"));
        m.put("Lycée", List.of("Français","Mathématiques","Anglais","Histoire-Géographie","Physique-Chimie","SVT","Philosophie","Espagnol","Informatique","Développement Web"));
        return m;
    }

    private List<Module> modulesFor(String s, String level) {
        List<String> names;
        if (s.equals("Français")) names = List.of("Comprendre un texte","Vocabulaire en contexte","La phrase et ses constituants","Accords et orthographe","Conjugaison progressive","Expression écrite","Lecture méthodique","Évaluation et remédiation","Révision générale");
        else if (s.equals("Mathématiques")) names = List.of("Nombres et calcul","Opérations et priorités","Fractions et décimaux","Proportionnalité et pourcentages","Géométrie et constructions","Grandeurs et mesures","Statistiques et données","Résolution de problèmes","Raisonnement et démonstration","Révision et évaluation");
        else if (s.equals("Anglais")) names = List.of("Greetings and introductions","Family and identity","School and everyday life","Numbers, dates and time","Present simple and routines","Past and future","Reading comprehension","Listening and speaking","Writing a short message","Assessment and revision");
        else if (s.equals("Sciences")) names = List.of("Observer et questionner","Matière et propriétés","Êtres vivants","Corps et hygiène","Alimentation et santé","Eau, air et environnement","Énergie et objets techniques","Mesurer et expérimenter","Bilan scientifique");
        else if (s.equals("Histoire-Géographie")) names = List.of("Se repérer dans le temps","Lire une carte","Territoire ivoirien","Populations et activités","Milieux et ressources","Étude de documents","Repères historiques","Citoyenneté et territoire","Composition et révision");
        else if (s.equals("EDHC")) names = List.of("Identité et respect","Droits et devoirs","Règles de vie","Solidarité","Protection de l'environnement","Prévention et sécurité","Citoyenneté numérique","Engagement communautaire","Évaluation");
        else if (s.equals("EPS")) names = List.of("Échauffement et sécurité","Athlétisme","Jeux collectifs","Coordination et motricité","Endurance","Gymnastique","Règles et arbitrage","Santé et récupération","Bilan pratique");
        else if (s.equals("Arts") || s.equals("Arts Plastiques")) names = List.of("Ligne et forme","Couleur et contraste","Composition","Observation et dessin","Création libre","Arts et culture ivoirienne","Projet artistique","Présentation d'une œuvre","Évaluation");
        else if (s.equals("Éducation Musicale")) names = List.of("Écouter une œuvre","Pulsation et rythme","Voix et respiration","Mélodie et hauteur","Instruments","Musique ivoirienne","Créer un rythme","Interpréter une chanson originale","Évaluation");
        else if (s.equals("SVT")) names = List.of("Démarche scientifique","Cellule et organisation du vivant","Nutrition et digestion","Respiration et circulation","Reproduction","Génétique et hérédité","Écosystèmes","Environnement et santé","Exploitation de documents","Révision");
        else if (s.equals("Physique-Chimie")) names = List.of("Grandeurs et mesures","Matière et mélanges","Mouvements et forces","Électricité","Lumière et optique","Transformations chimiques","Énergie","Travaux pratiques","Résolution d'exercices","Révision");
        else if (s.equals("Philosophie")) names = List.of("Pourquoi philosopher ?","Conscience et inconscient","Liberté et responsabilité","Vérité et connaissance","Justice et droit","Travail et technique","État et politique","Art et culture","Bonheur et morale","Dissertation et explication de texte");
        else if (s.equals("Espagnol")) names = List.of("Saludos e identidad","La familia","La escuela","Rutinas y tiempo","Descripción y gustos","Pasado y futuro","Comprensión escrita","Comprensión auditiva","Expresión escrita","Repaso");
        else if (s.equals("Informatique")) names = List.of("Culture numérique","Composants d'un ordinateur","Système et fichiers","Algorithmique","Variables et conditions","Boucles et fonctions","Données et tableaux","Internet et réseaux","Cybersécurité","Projet informatique");
        else if (s.equals("Développement Web")) names = List.of("Comprendre le Web","HTML : structure","HTML : liens, images et formulaires","CSS : sélecteurs et boîte","CSS : mise en page responsive","JavaScript : variables et conditions","JavaScript : fonctions et événements","DOM et interactions","API, JSON et fetch","Projet : créer un jeu éducatif");
        else names = List.of("Découverte","Notions essentielles","Méthode","Exemples","Exercices","Projet","Évaluation","Révision");
        List<Module> out = new ArrayList<>();
        for (String n : names) out.add(moduleFor(n, s, level));
        return out;
    }

    private Module moduleFor(String n, String s, String level) {
        Module m = new Module(); m.title=n;
        m.objective = objective(n,s,level); m.discovery=discovery(n,s); m.knowledge=knowledge(n,s); m.examples=examples(n,s,level); m.practice=practice(n,s); m.correction=correction(n,s);
        return m;
    }
    private String objective(String n,String s,String l){
        if(s.equals("Mathématiques")) return "Comprendre " + n.toLowerCase() + " et résoudre une situation adaptée au niveau " + l + ".";
        if(s.equals("Anglais")) return "Utiliser le vocabulaire et les structures de " + n.toLowerCase() + " dans une communication simple.";
        if(s.equals("Développement Web")) return "Construire progressivement une compétence de développement web autour de " + n + ".";
        if(s.equals("Informatique")) return "Identifier, expliquer puis utiliser les notions de " + n.toLowerCase() + ".";
        return "Comprendre les notions essentielles de « " + n + " », les appliquer et expliquer son raisonnement au niveau " + l + ".";
    }
    private String discovery(String n,String s){
        if(s.equals("Mathématiques")) return "Pars d'une situation concrète : quantité, distance, prix, durée ou figure. Cherche ce que l'on connaît, ce que l'on cherche et quelle opération ou représentation peut relier les deux.";
        if(s.equals("Anglais")) return "Écoute ou lis de courtes expressions, repère les mots connus, puis répète à voix haute. L'objectif est de comprendre le sens avant de mémoriser la règle.";
        if(s.equals("Développement Web")) return "Observe une page web : contenu, mise en forme et comportement sont trois dimensions différentes. On va isoler la compétence du jour puis la tester dans le navigateur.";
        if(s.equals("Informatique")) return "Observe l'outil ou la situation, formule une hypothèse, réalise une manipulation, puis compare le résultat avec ton hypothèse.";
        return "Commence par une situation proche de la vie quotidienne. Pose une question, observe les informations utiles et formule une première réponse avant d'étudier la notion.";
    }
    private String knowledge(String n,String s){
        if(s.equals("Mathématiques")) return "Méthode : 1) lire la consigne ; 2) relever les données ; 3) choisir une représentation ; 4) effectuer les calculs ; 5) vérifier l'ordre de grandeur ; 6) rédiger une réponse complète. Toujours distinguer unité, résultat et justification.";
        if(s.equals("Anglais")) return "Vocabulaire clé : hello, good morning, family, school, today, yesterday, tomorrow, like, have, go, can. Pour construire une phrase, penser sujet + verbe + complément et vérifier le temps demandé.";
        if(s.equals("Développement Web")) return "Un projet web combine HTML pour structurer, CSS pour présenter et JavaScript pour rendre la page interactive. Le navigateur lit les fichiers et construit le DOM avant d'exécuter les scripts.";
        if(s.equals("Informatique")) return "Une information numérique est représentée par des données. Un programme décrit des instructions exécutées selon un ordre logique. Un réseau permet à des appareils de communiquer selon des protocoles.";
        return "Retenir quatre idées : définition de la notion, vocabulaire précis, exemple concret, puis limite ou exception. Une bonne réponse doit utiliser le vocabulaire du cours et justifier les affirmations importantes.";
    }
    private String examples(String n,String s,String l){
        if(s.equals("Mathématiques")) return "Exemple : un article coûte 5 000 F et une réduction est appliquée. Écris les données, choisis le calcul approprié, effectue-le, puis formule la réponse avec l'unité FCFA. Exemple géométrique : trace d'abord la figure et marque les données avant de calculer.";
        if(s.equals("Anglais")) return "Example 1: “I am a student.” Example 2: “I go to school every day.” Example 3: “Yesterday, I studied.” Read each sentence aloud, identify the subject and verb, then change one element.";
        if(s.equals("Développement Web")) return "Exemple : <button id=\"start\">Commencer</button> crée une action visible en HTML. CSS peut modifier sa présentation. JavaScript peut écouter le clic avec addEventListener et modifier le contenu de la page.";
        if(s.equals("Informatique")) return "Exemple algorithmique : si une note est supérieure ou égale à 10, afficher « admis », sinon « à renforcer ». On identifie une entrée, une condition et une sortie.";
        return "Exemple guidé : prends une situation simple, souligne les informations importantes, nomme la notion étudiée, puis explique en deux ou trois phrases pourquoi cette notion permet de résoudre ou comprendre la situation.";
    }
    private String practice(String n,String s){
        if(s.equals("Mathématiques")) return "Exercice 1 : invente une situation utilisant la notion du chapitre. Exercice 2 : résous-la en détaillant les étapes. Exercice 3 : explique ton résultat à un camarade sans lire la correction.";
        if(s.equals("Anglais")) return "Practice: write 5 sentences using the vocabulary of the lesson. Then read them aloud. Transform two sentences into questions and two into negative forms when the grammar allows it.";
        if(s.equals("Développement Web")) return "Défi : crée un mini-fichier autonome et teste-le dans le navigateur. Ajoute une amélioration personnelle : un bouton, un compteur, une validation ou un message utilisateur.";
        if(s.equals("Informatique")) return "Défi : reproduis la notion sur un exemple personnel. Écris les étapes sous forme de liste ou pseudo-code, puis teste chaque étape et note ce qui change.";
        return "Activité : 1) réponds sans le cours ; 2) compare avec la définition ; 3) donne un exemple ivoirien ou quotidien ; 4) rédige une réponse courte et une réponse développée.";
    }
    private String correction(String n,String s){
        if(s.equals("Mathématiques")) return "Correction-type : la démarche est validée si les données sont correctement identifiées, si la méthode choisie répond réellement à la question, si le calcul est exact et si la réponse finale comporte une unité ou une interprétation. Une erreur de calcul isolée doit être distinguée d'une erreur de méthode.";
        if(s.equals("Anglais")) return "Correction-type: check subject, verb, word order, tense and spelling. A sentence is accepted when the intended meaning is clear and the grammar used matches the task.";
        if(s.equals("Développement Web")) return "Correction-type : vérifier la structure du fichier, les noms des sélecteurs, la console du navigateur et le comportement attendu. Corriger une erreur à la fois puis retester.";
        if(s.equals("Informatique")) return "Correction-type : comparer les étapes prévues et les étapes exécutées. Si le résultat est faux, localiser la première étape où la sortie diffère de l'attendu.";
        return "Correction-type : une réponse complète contient la notion, l'explication, un exemple et une justification. Si un élément manque, reformule la réponse puis vérifie le vocabulaire.";
    }


    private void seedAdmin(UserAccountRepository accounts, PasswordEncoder encoder) {
        String email = "admin@edufun.ci";
        if (accounts.findByEmailIgnoreCase(email).isEmpty()) {
            UserAccount a = new UserAccount();
            a.setEmail(email); a.setPasswordHash(encoder.encode("EduFun@2026")); a.setRole("ADMIN"); a.setEnabled(true);
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
    private String enc(String x){return x.trim().replace(" ","+");}

    private static class Module { String title,objective,discovery,knowledge,examples,practice,correction; }
}
