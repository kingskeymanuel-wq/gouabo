package com.edufun.portal.tutoring;

import java.util.List;

/** Villes de Côte d'Ivoire et communes d'Abidjan proposées dans les filtres de l'annuaire. */
public final class Places {
    private Places() {}

    public static final String ABIDJAN = "Abidjan";

    /** Les dix communes de la ville d'Abidjan, plus les trois sous-préfectures du district. */
    public static final List<String> ABIDJAN_COMMUNES = List.of(
            "Abobo", "Adjamé", "Attécoubé", "Cocody", "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Treichville", "Yopougon",
            "Anyama", "Bingerville", "Songon");

    public static final List<String> CITIES = List.of(
            "Abidjan", "Abengourou", "Aboisso", "Agboville", "Bondoukou", "Bouaflé", "Bouaké", "Dabou", "Daloa", "Divo",
            "Ferkessédougou", "Gagnoa", "Grand-Bassam", "Guiglo", "Issia", "Katiola", "Korhogo", "Man", "Odienné", "Oumé",
            "San-Pédro", "Sassandra", "Séguéla", "Sinfra", "Soubré", "Toumodi", "Yamoussoukro");
}
