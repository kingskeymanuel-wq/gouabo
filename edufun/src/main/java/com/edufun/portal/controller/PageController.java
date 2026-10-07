package com.edufun.portal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import com.edufun.portal.curriculum.Levels;
import java.util.*;

@Controller
public class PageController {
    @GetMapping("/") public String home(){ return "redirect:/dashboard"; }
    @GetMapping("/login") public String login(){ return "login"; }
    @GetMapping("/dashboard") public String dashboard(){return "dashboard";}
    @GetMapping("/inscription") public String inscription(Model model){ model.addAttribute("levelsByCycle",levelsByCycle()); return "inscription"; }
    @GetMapping("/profil") public String profile(Model model){ model.addAttribute("levelsByCycle",levelsByCycle()); return "profil"; }
    private static Map<String,List<String>> levelsByCycle(){
        Map<String,List<String>> byCycle=new LinkedHashMap<>();
        Levels.all().forEach(l->byCycle.computeIfAbsent(l.cycle(),k->new ArrayList<>()).add(l.code()));
        return byCycle;
    }
    @GetMapping("/programme") public String programme(){return "programme";}
    @GetMapping("/abonnement") public String subscription(){return "abonnement";}
    @GetMapping("/bilans") public String reports(){return "bilans";}
    // Portail répétiteurs et parents (annuaire)
    @GetMapping("/repetiteurs") public String tutorDirectory(){return "annuaire";}
    @GetMapping("/repetiteurs/fiche/{id}") public String tutorProfile(){return "annuaire-fiche";}
    @GetMapping("/repetiteurs/messages") public String familyMessages(){return "annuaire-messages";}
    @GetMapping("/parent/inscription") public String parentSignup(){return "parent-inscription";}
    @GetMapping("/repetiteur") public String tutorHome(){return "redirect:/repetiteur/connexion";}
    @GetMapping("/repetiteur/connexion") public String tutorLogin(){return "repetiteur-connexion";}
    @GetMapping("/repetiteur/inscription") public String tutorSignup(){return "repetiteur-inscription";}
    @GetMapping("/repetiteur/espace") public String tutorSpace(){return "repetiteur-espace";}
    // Portail d'administration
    @GetMapping("/console") public String adminLogin(){return "console-connexion";}
    @GetMapping("/lecon/{id}") public String lessonReader(){return "lecon";}
    @GetMapping("/examens") public String examens(){return "examens";}
    @GetMapping("/tech-lab") public String tech(){return "tech-lab";}
    @GetMapping("/administration") public String admin(){return "administration";}
    @GetMapping("/quiz") public String quiz(){return "quiz";}
    @GetMapping("/certificats") public String certificates(){return "certificats";}
}
