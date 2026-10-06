package com.edufun.portal.prep;

import com.edufun.portal.model.ExamAttempt;
import com.edufun.portal.model.UserAccount;
import com.edufun.portal.repository.ExamAttemptRepository;
import com.edufun.portal.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/prep")
public class ExamPrepController {
    private final ExamPrepService prep;
    private final ExamAttemptRepository attempts;
    private final UserAccountRepository accounts;

    public ExamPrepController(ExamPrepService prep, ExamAttemptRepository attempts, UserAccountRepository accounts) {
        this.prep = prep; this.attempts = attempts; this.accounts = accounts;
    }

    /** Vue d'ensemble : examens, présentation, FAQ et liste des matières (sans le détail). */
    @GetMapping
    public List<Map<String, Object>> overview() {
        List<Map<String, Object>> out = new ArrayList<>();
        for (ExamPrepService.Exam e : prep.all()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("code", e.code()); m.put("name", e.name()); m.put("fullName", e.fullName()); m.put("level", e.level());
            m.put("intro", e.intro()); m.put("faq", e.faq());
            m.put("subjects", e.subjects().stream().map(s -> Map.of("slug", s.slug(), "name", s.name(), "duration", s.duration(),
                    "series", s.series(), "sujets", s.sujets().size(), "qcm", countQuestions(s.qcm()))).toList());
            out.add(m);
        }
        return out;
    }

    @GetMapping("/{exam}/{subject}")
    public ExamPrepService.Subject subject(@PathVariable String exam, @PathVariable String subject) {
        return prep.exam(exam).flatMap(e -> e.subjects().stream().filter(s -> s.slug().equals(subject)).findFirst())
                .orElseThrow(() -> new NoSuchElementException("Matière introuvable"));
    }

    public record AttemptRequest(String exam, String subject, int score, int total) {}

    /** Enregistre le résultat d'un QCM d'entraînement (corrigé automatiquement). */
    @PostMapping("/attempts")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> attempt(@RequestBody AttemptRequest r, Authentication auth) {
        UserAccount account = student(auth);
        ExamPrepService.Exam e = prep.exam(r.exam()).orElseThrow(() -> new NoSuchElementException("Examen introuvable"));
        ExamPrepService.Subject s = subject(r.exam(), r.subject());
        if (r.total() <= 0 || r.score() < 0 || r.score() > r.total()) throw new IllegalArgumentException("Score invalide");
        ExamAttempt a = new ExamAttempt();
        a.setStudentId(account.getStudentId()); a.setExamType(e.name()); a.setLevel(e.level()); a.setSubject(s.name());
        a.setScore(r.score()); a.setTotal(r.total()); a.setMinutes(0);
        a.setStatus(r.score() * 2 >= r.total() ? "PASSED" : "FAILED");
        a.setCreatedAt(LocalDateTime.now());
        attempts.save(a);
        return Map.of("score", r.score(), "total", r.total(), "percent", Math.round(r.score() * 100.0 / r.total()));
    }

    /** Historique des QCM de l'élève connecté pour un examen. */
    @GetMapping("/{exam}/history")
    public List<Map<String, Object>> history(@PathVariable String exam, Authentication auth) {
        UserAccount account = student(auth);
        String name = prep.exam(exam).map(ExamPrepService.Exam::name).orElse("");
        return attempts.findByStudentIdOrderByCreatedAtDesc(account.getStudentId()).stream()
                .filter(a -> name.equals(a.getExamType())).limit(20)
                .map(a -> Map.<String, Object>of("subject", a.getSubject(), "score", a.getScore(), "total", a.getTotal(), "at", a.getCreatedAt()))
                .toList();
    }

    private UserAccount student(Authentication auth) {
        if (auth == null) throw new AccessDeniedException("Connexion requise");
        UserAccount a = accounts.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new AccessDeniedException("Compte introuvable"));
        if (a.getStudentId() == null) throw new AccessDeniedException("Réservé aux élèves");
        return a;
    }

    private static int countQuestions(String qcm) {
        return (int) qcm.lines().filter(l -> l.trim().startsWith("?")).count();
    }
}
