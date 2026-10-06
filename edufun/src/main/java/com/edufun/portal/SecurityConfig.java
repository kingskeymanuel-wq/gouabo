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

    @Bean SecurityFilterChain security(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(a -> a
                .requestMatchers("/login", "/inscription", "/", "/css/**", "/js/**", "/vendor/**", "/api/auth/register", "/api/auth/me", "/api/auth/csrf").permitAll()
                // Écritures autorisées à un élève connecté (la propriété du compte est vérifiée dans les contrôleurs)
                .requestMatchers(HttpMethod.POST, "/api/lessons/*/complete", "/api/quizzes/*/submit", "/api/exams", "/api/tutors", "/api/prep/attempts").authenticated()
                // Toute autre écriture sur l'API est réservée à l'administration
                .requestMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                // Lectures réservées à l'administration
                .requestMatchers("/administration", "/api/dashboard", "/api/students", "/api/students/*", "/api/tutor-assignments/**", "/api/lessons", "/api/videos", "/api/exam-sessions/**", "/api/curriculum-versions", "/api/badges", "/api/program/summary").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/exams").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.loginPage("/login").defaultSuccessUrl("/dashboard", true).failureUrl("/login?error").permitAll())
            .logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/login?logout").invalidateHttpSession(true).deleteCookies("JSESSIONID").permitAll())
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/auth/register"));
        return http.build();
    }
}
