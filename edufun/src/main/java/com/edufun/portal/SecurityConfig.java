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
                .requestMatchers("/administration", "/api/dashboard", "/api/students", "/api/students/*", "/api/tutor-assignments/**", "/api/lessons", "/api/videos", "/api/exam-sessions/**", "/api/curriculum-versions", "/api/badges").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/courses/**", "/api/tutors", "/api/certificates").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/courses").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/tutors").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/courses/**", "/api/tutors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/students/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/students/*/progress").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/certificates").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/exams").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/exams").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/exams/*/review").hasRole("ADMIN")
                .requestMatchers("/api/curriculum", "/api/levels", "/api/subjects", "/api/lessons/**", "/api/lessons/*/videos", "/api/quizzes", "/api/quizzes/**").authenticated()
                .requestMatchers("/dashboard", "/programme", "/lecon/**", "/examens", "/quiz", "/tech-lab", "/repetiteurs", "/certificats", "/api/exams/**", "/api/quiz-attempts", "/api/students/*/progress", "/api/students/*/quiz-attempts", "/api/students/*/badges", "/api/lessons/*/complete", "/api/student-dashboard/*").authenticated()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.loginPage("/login").defaultSuccessUrl("/dashboard", true).failureUrl("/login?error").permitAll())
            .logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/login?logout").invalidateHttpSession(true).deleteCookies("JSESSIONID").permitAll())
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/auth/register"));
        return http.build();
    }
}
