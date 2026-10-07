package com.edufun.portal;

import com.edufun.portal.security.CustomUserDetailsService;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService service, PasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(service);
        provider.setPasswordEncoder(encoder);
        return provider;
    }

    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean SecurityContextRepository securityContextRepository() { return new HttpSessionSecurityContextRepository(); }

    /** Trois portails séparés : élèves (cours), répétiteurs et parents (annuaire), administration (CRM). */
    @Bean SecurityFilterChain security(HttpSecurity http, com.edufun.portal.repository.UserAccountRepository accounts) throws Exception {
        String[] studentPages = {"/dashboard", "/programme", "/lecon/**", "/examens", "/quiz", "/certificats", "/tech-lab", "/profil", "/abonnement", "/bilans"};
        http
            .authorizeHttpRequests(a -> a
                // Pages et API publiques
                .requestMatchers("/", "/login", "/inscription", "/css/**", "/js/**", "/vendor/**", "/favicon.ico", "/error",
                        "/repetiteurs", "/repetiteurs/fiche/*", "/repetiteur", "/repetiteur/connexion", "/repetiteur/inscription", "/parent/inscription", "/console").permitAll()
                .requestMatchers("/api/auth/register", "/api/auth/me", "/api/auth/csrf", "/api/tutor/register", "/api/parent/register", "/api/tutors/search", "/api/places").permitAll()
                // Portail des cours (élèves) ; l'administrateur peut y accéder pour vérifier les contenus
                .requestMatchers(studentPages).hasAnyRole("STUDENT", "ADMIN")
                .requestMatchers("/api/student/**").hasRole("STUDENT")
                // Portail répétiteur
                .requestMatchers("/repetiteur/espace", "/repetiteur/espace/**", "/api/tutor/**").hasRole("TUTOR")
                // Messagerie des familles
                .requestMatchers("/repetiteurs/messages").hasAnyRole("PARENT", "STUDENT")
                // Écritures autorisées hors administration (la propriété du compte est vérifiée dans les contrôleurs)
                .requestMatchers(HttpMethod.PATCH, "/api/auth/profile").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/auth/password", "/api/billing/payments", "/api/lessons/*/complete", "/api/quizzes/*/submit", "/api/exams",
                        "/api/prep/attempts", "/api/messages", "/api/notifications/read").authenticated()
                // Toute autre écriture sur l'API est réservée à l'administration
                .requestMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                // Lectures réservées à l'administration
                .requestMatchers("/administration", "/administration/**", "/api/admin/**", "/api/dashboard", "/api/students", "/api/students/*", "/api/tutor-assignments/**", "/api/lessons", "/api/videos", "/api/exam-sessions/**", "/api/curriculum-versions", "/api/badges", "/api/program/summary").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/exams", "/api/tutors").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.loginPage("/login")
                // Chaque rôle arrive dans son propre portail.
                .successHandler((req, res, auth) -> {
                    accounts.findByEmailIgnoreCase(auth.getName()).ifPresent(acc -> { acc.setLastLoginAt(java.time.LocalDateTime.now()); accounts.save(acc); });
                    String role = auth.getAuthorities().stream().map(x -> x.getAuthority().replace("ROLE_", "")).findFirst().orElse("STUDENT");
                    res.sendRedirect(com.edufun.portal.security.AccountSessions.home(role));
                })
                .failureHandler((req, res, ex) -> {
                    String portal = String.valueOf(req.getParameter("portal"));
                    res.sendRedirect(switch (portal) { case "tutor" -> "/repetiteur/connexion?error"; case "admin" -> "/console?error"; default -> "/login?error"; });
                })
                .permitAll())
            .exceptionHandling(e -> e
                // L'API répond 401 sans session ; les pages redirigent vers la connexion du bon portail.
                .authenticationEntryPoint((req, res, ex) -> {
                    String uri = req.getRequestURI();
                    if (uri.startsWith("/api/")) { res.sendError(401); return; }
                    res.sendRedirect(uri.startsWith("/repetiteur/") ? "/repetiteur/connexion" : uri.startsWith("/administration") ? "/console" : "/login");
                })
                .accessDeniedHandler((req, res, ex) -> {
                // Un compte qui ouvre la page d'un autre portail est renvoyé vers le sien ; l'API répond 403.
                if (req.getRequestURI().startsWith("/api/")) { res.sendError(403); return; }
                var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                String role = auth == null ? "" : auth.getAuthorities().stream().map(x -> x.getAuthority().replace("ROLE_", "")).findFirst().orElse("");
                res.sendRedirect(com.edufun.portal.security.AccountSessions.home(role));
            }))
            .logout(logout -> logout.logoutUrl("/logout").logoutSuccessHandler((req, res, auth) -> {
                String role = auth == null ? "" : auth.getAuthorities().stream().map(x -> x.getAuthority().replace("ROLE_", "")).findFirst().orElse("");
                res.sendRedirect(switch (role) { case "TUTOR" -> "/repetiteur/connexion?logout"; case "PARENT" -> "/repetiteurs?logout"; case "ADMIN" -> "/console?logout"; default -> "/login?logout"; });
            }).invalidateHttpSession(true).deleteCookies("JSESSIONID").permitAll())
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/auth/register", "/api/tutor/register", "/api/parent/register"));
        return http.build();
    }
}
