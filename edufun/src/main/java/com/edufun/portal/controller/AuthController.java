package com.edufun.portal.controller;

import com.edufun.portal.model.Student;
import com.edufun.portal.model.UserAccount;
import com.edufun.portal.repository.StudentRepository;
import com.edufun.portal.repository.UserAccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final StudentRepository students;
    private final UserAccountRepository accounts;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(StudentRepository students, UserAccountRepository accounts, PasswordEncoder encoder,
                          AuthenticationManager authenticationManager, SecurityContextRepository securityContextRepository) {
        this.students = students; this.accounts = accounts; this.encoder = encoder;
        this.authenticationManager = authenticationManager; this.securityContextRepository = securityContextRepository;
    }

    public record RegisterRequest(String name, String email, String password, String level) {}

    @PostMapping("/register")
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest, HttpServletResponse response) {
        String name = request.name() == null ? "" : request.name().trim();
        String email = request.email() == null ? "" : request.email().trim().toLowerCase();
        String password = request.password() == null ? "" : request.password();
        String level = request.level() == null ? "" : request.level().trim();
        if (name.length() < 2 || email.isBlank() || !email.contains("@") || password.length() < 8 || level.isBlank()) {
            throw new IllegalArgumentException("Nom, niveau, email valide et mot de passe de 8 caractères minimum sont requis.");
        }
        if (!com.edufun.portal.curriculum.Levels.exists(level)) throw new IllegalArgumentException("Classe inconnue : choisis ta classe dans la liste.");
        if (accounts.existsByEmailIgnoreCase(email)) {
            throw new IllegalStateException("Cette adresse e-mail possède déjà un espace EduFun. Utilise la connexion.");
        }

        Student student = students.findByEmailIgnoreCase(email).orElseGet(Student::new);
        student.setName(name); student.setEmail(email); student.setLevel(level);
        if (student.getXp() < 0) student.setXp(0);
        if (student.getStreak() < 0) student.setStreak(0);
        student.setStatus("ACTIVE");
        student = students.save(student);

        UserAccount account = new UserAccount();
        account.setEmail(email); account.setPasswordHash(encoder.encode(password)); account.setRole("STUDENT"); account.setStudentId(student.getId()); account.setEnabled(true);
        accounts.save(account);

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, response);

        return mePayload(student, account);
    }

    public record ProfileRequest(String name, String level) {}
    public record PasswordRequest(String currentPassword, String newPassword) {}

    // L'élève modifie son nom et sa classe (changement de série, passage en classe supérieure).
    @PatchMapping("/profile")
    @Transactional
    public Map<String,Object> updateProfile(@RequestBody ProfileRequest request, Authentication auth) {
        UserAccount account = studentAccount(auth);
        Student student = students.findById(account.getStudentId()).orElseThrow();
        String name = request.name() == null ? student.getName() : request.name().trim();
        String level = request.level() == null ? student.getLevel() : request.level().trim();
        if (name.length() < 2) throw new IllegalArgumentException("Ton nom doit contenir au moins 2 caractères.");
        if (!com.edufun.portal.curriculum.Levels.exists(level)) throw new IllegalArgumentException("Classe inconnue : choisis ta classe dans la liste.");
        student.setName(name); student.setLevel(level);
        return mePayload(students.save(student), account);
    }

    @PostMapping("/password")
    @Transactional
    public Map<String,Object> changePassword(@RequestBody PasswordRequest request, Authentication auth) {
        UserAccount account = accounts.findByEmailIgnoreCase(auth == null ? "" : auth.getName()).orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("Connexion requise"));
        if (request.currentPassword() == null || !encoder.matches(request.currentPassword(), account.getPasswordHash())) throw new IllegalArgumentException("Le mot de passe actuel est incorrect.");
        if (request.newPassword() == null || request.newPassword().length() < 8) throw new IllegalArgumentException("Le nouveau mot de passe doit contenir au moins 8 caractères.");
        account.setPasswordHash(encoder.encode(request.newPassword()));
        accounts.save(account);
        return Map.of("success", true);
    }

    private UserAccount studentAccount(Authentication auth) {
        UserAccount account = accounts.findByEmailIgnoreCase(auth == null ? "" : auth.getName()).orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("Connexion requise"));
        if (account.getStudentId() == null) throw new org.springframework.security.access.AccessDeniedException("Cet espace est réservé aux élèves.");
        return account;
    }

    @GetMapping("/csrf")
    public Map<String,String> csrf(CsrfToken token) { return Map.of("token", token.getToken(), "headerName", token.getHeaderName()); }

    @GetMapping("/me")
    public Map<String,Object> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails)) return Map.of("authenticated", false);
        UserAccount account = accounts.findByEmailIgnoreCase(authentication.getName()).orElseThrow();
        Map<String,Object> out = new LinkedHashMap<>(); out.put("authenticated", true); out.putAll(mePayload(account.getStudentId() == null ? null : students.findById(account.getStudentId()).orElse(null), account)); return out;
    }

    private Map<String,Object> mePayload(Student student, UserAccount account) {
        Map<String,Object> out = new LinkedHashMap<>();
        out.put("authenticated", true); out.put("email", account.getEmail()); out.put("role", account.getRole()); out.put("studentId", account.getStudentId());
        if (student != null) { out.put("name", student.getName()); out.put("level", student.getLevel()); out.put("xp", student.getXp()); out.put("streak", student.getStreak()); }
        return out;
    }
}
