package com.edufun.portal.curriculum;

import java.util.*;

/**
 * Référentiel des classes du système éducatif ivoirien (CP1 → Terminale)
 * et des disciplines enseignées dans chacune, dans l'ordre officiel.
 */
public final class Levels {
    private Levels() {}

    public static final String PRIMAIRE = "Primaire";
    public static final String COLLEGE = "Collège";
    public static final String LYCEE = "Lycée";

    private static final List<String> CP_SUBJECTS = List.of(
            "Français", "Mathématiques", "Sciences et Technologie", "EDHC", "AEC", "EPS");
    private static final List<String> PRIMAIRE_SUBJECTS = List.of(
            "Français", "Mathématiques", "Sciences et Technologie", "Histoire-Géographie", "EDHC", "AEC", "EPS");
    private static final List<String> COLLEGE_SUBJECTS = List.of(
            "Français", "Mathématiques", "Anglais", "Physique-Chimie", "SVT", "Histoire-Géographie", "EDHC",
            "Arts Plastiques", "Éducation Musicale", "EPS");
    private static final List<String> COLLEGE_LV2_SUBJECTS = List.of(
            "Français", "Mathématiques", "Anglais", "Espagnol", "Physique-Chimie", "SVT", "Histoire-Géographie", "EDHC",
            "Arts Plastiques", "Éducation Musicale", "EPS");
    private static final List<String> LYCEE_SCIENCE_SUBJECTS = List.of(
            "Français", "Mathématiques", "Physique-Chimie", "SVT", "Histoire-Géographie", "Anglais", "EDHC", "EPS");
    private static final List<String> LYCEE_SCIENCE_PHILO_SUBJECTS = List.of(
            "Français", "Philosophie", "Mathématiques", "Physique-Chimie", "SVT", "Histoire-Géographie", "Anglais", "EDHC", "EPS");
    private static final List<String> LYCEE_A_SUBJECTS = List.of(
            "Français", "Mathématiques", "Histoire-Géographie", "Anglais", "Espagnol", "SVT", "EDHC", "EPS");
    private static final List<String> LYCEE_A_PHILO_SUBJECTS = List.of(
            "Français", "Philosophie", "Mathématiques", "Histoire-Géographie", "Anglais", "Espagnol", "SVT", "EDHC", "EPS");

    private static final LinkedHashMap<String, Level> LEVELS = new LinkedHashMap<>();
    static {
        add("CP1", PRIMAIRE, CP_SUBJECTS);
        add("CP2", PRIMAIRE, CP_SUBJECTS);
        for (String l : List.of("CE1", "CE2", "CM1", "CM2")) add(l, PRIMAIRE, PRIMAIRE_SUBJECTS);
        add("6e", COLLEGE, COLLEGE_SUBJECTS);
        add("5e", COLLEGE, COLLEGE_SUBJECTS);
        add("4e", COLLEGE, COLLEGE_LV2_SUBJECTS);
        add("3e", COLLEGE, COLLEGE_LV2_SUBJECTS);
        add("Seconde A", LYCEE, LYCEE_A_SUBJECTS);
        add("Seconde C", LYCEE, LYCEE_SCIENCE_SUBJECTS);
        add("Première A", LYCEE, LYCEE_A_PHILO_SUBJECTS);
        add("Première C", LYCEE, LYCEE_SCIENCE_PHILO_SUBJECTS);
        add("Première D", LYCEE, LYCEE_SCIENCE_PHILO_SUBJECTS);
        add("Terminale A", LYCEE, LYCEE_A_PHILO_SUBJECTS);
        add("Terminale C", LYCEE, LYCEE_SCIENCE_PHILO_SUBJECTS);
        add("Terminale D", LYCEE, LYCEE_SCIENCE_PHILO_SUBJECTS);
    }

    /** Anciennes valeurs (sans série) → classe actuelle. */
    private static final Map<String, String> LEGACY = Map.of("2nde", "Seconde C", "Première", "Première D", "Terminale", "Terminale D");

    private static void add(String code, String cycle, List<String> subjects) { LEVELS.put(code, new Level(code, cycle, subjects)); }

    public record Level(String code, String cycle, List<String> subjects) {}

    public static List<Level> all() { return List.copyOf(LEVELS.values()); }
    public static List<String> codes() { return List.copyOf(LEVELS.keySet()); }
    public static boolean exists(String code) { return code != null && LEVELS.containsKey(code); }
    public static Optional<Level> find(String code) { return Optional.ofNullable(code == null ? null : LEVELS.get(code)); }

    /** Rang d'une discipline dans la classe (pour trier les leçons), 99 si elle n'y figure pas. */
    public static int subjectRank(String level, String subject) {
        int i = find(level).map(l -> l.subjects().indexOf(subject)).orElse(-1);
        return i < 0 ? 99 : i;
    }

    public static String migrate(String code) { return LEGACY.getOrDefault(code, code); }
    public static Map<String, String> legacy() { return LEGACY; }
}
