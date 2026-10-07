package com.edufun.portal.security;

import com.edufun.portal.model.UserAccount;
import com.edufun.portal.repository.UserAccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

import java.util.Set;

/** Ouverture de session après inscription et accès au compte connecté, pour tous les portails. */
@Component
public class AccountSessions {
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository contextRepository;
    private final UserAccountRepository accounts;

    public AccountSessions(AuthenticationManager authenticationManager, SecurityContextRepository contextRepository, UserAccountRepository accounts) {
        this.authenticationManager = authenticationManager; this.contextRepository = contextRepository; this.accounts = accounts;
    }

    public void login(String email, String password, HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        contextRepository.saveContext(context, request, response);
    }

    public UserAccount current(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) throw new AccessDeniedException("Connexion requise");
        return accounts.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new AccessDeniedException("Compte introuvable"));
    }

    public UserAccount require(Authentication auth, String... roles) {
        UserAccount a = current(auth);
        if (!Set.of(roles).contains(a.getRole())) throw new AccessDeniedException("Espace non autorisé pour ce compte");
        return a;
    }

    public static String home(String role) {
        return switch (role == null ? "" : role) {
            case "ADMIN" -> "/administration";
            case "TUTOR" -> "/repetiteur/espace";
            case "PARENT" -> "/repetiteurs";
            default -> "/dashboard";
        };
    }
}
