package com.edufun.portal.notify;

import com.edufun.portal.model.Student;
import com.edufun.portal.model.UserAccount;
import com.edufun.portal.repository.StudentRepository;
import com.edufun.portal.security.AccountSessions;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/** Bilans bimestriels de l'élève connecté, et envoi au parent. */
@RestController
@RequestMapping("/api/student/reports")
public class ReportController {
    private final ReportService reports;
    private final StudentRepository students;
    private final AccountSessions sessions;

    public ReportController(ReportService reports, StudentRepository students, AccountSessions sessions) {
        this.reports = reports; this.students = students; this.sessions = sessions;
    }

    @GetMapping
    public Map<String, Object> list(Authentication auth) {
        Student s = me(auth);
        return Map.of("student", Map.of("name", s.getName(), "level", s.getLevel(), "parentEmail", s.getParentEmail() == null ? "" : s.getParentEmail()),
                "mailConfigured", true, "reports", reports.reports(s));
    }

    @PostMapping("/send")
    public Map<String, Object> send(@RequestParam(defaultValue = "0") int index, Authentication auth) {
        Student s = me(auth);
        List<Map<String, Object>> list = reports.reports(s);
        if (index < 0 || index >= list.size()) throw new IllegalArgumentException("Bilan introuvable");
        var n = reports.sendReport(s, list.get(index));
        return Map.of("sentTo", n.getEmailTo(), "emailStatus", n.getEmailStatus());
    }

    private Student me(Authentication auth) {
        UserAccount a = sessions.require(auth, "STUDENT");
        return students.findById(a.getStudentId()).orElseThrow(() -> new NoSuchElementException("Élève introuvable"));
    }
}
