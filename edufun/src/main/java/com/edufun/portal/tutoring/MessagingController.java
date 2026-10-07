package com.edufun.portal.tutoring;

import com.edufun.portal.model.*;
import com.edufun.portal.notify.NotificationService;
import com.edufun.portal.repository.*;
import com.edufun.portal.security.AccountSessions;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/** Messagerie entre répétiteurs et familles, et notifications de chaque espace. */
@RestController
@RequestMapping("/api")
public class MessagingController {
    private final MessageRepository messages;
    private final UserAccountRepository accounts;
    private final TutorRepository tutors;
    private final ProfileVisitRepository visits;
    private final StudentRepository students;
    private final NotificationService notify;
    private final AccountSessions sessions;

    public MessagingController(MessageRepository messages, UserAccountRepository accounts, TutorRepository tutors, ProfileVisitRepository visits,
                               StudentRepository students, NotificationService notify, AccountSessions sessions) {
        this.messages = messages; this.accounts = accounts; this.tutors = tutors; this.visits = visits; this.students = students;
        this.notify = notify; this.sessions = sessions;
    }

    // ---------------- Conversations

    @GetMapping("/messages/threads")
    public List<Map<String, Object>> threads(Authentication auth) {
        UserAccount me = sessions.current(auth);
        Map<Long, Map<String, Object>> out = new LinkedHashMap<>();
        for (Message m : messages.findAllFor(me.getId())) {
            Long other = me.getId().equals(m.getFromAccountId()) ? m.getToAccountId() : m.getFromAccountId();
            Map<String, Object> t = out.computeIfAbsent(other, k -> {
                Map<String, Object> x = new LinkedHashMap<>(describe(k));
                x.put("lastMessage", m.getBody()); x.put("lastAt", m.getCreatedAt()); x.put("lastFromMe", me.getId().equals(m.getFromAccountId())); x.put("unread", 0L);
                return x;
            });
            if (me.getId().equals(m.getToAccountId()) && m.getReadAt() == null) t.put("unread", (Long) t.get("unread") + 1);
        }
        return new ArrayList<>(out.values());
    }

    @GetMapping("/messages/with/{accountId}")
    @Transactional
    public Map<String, Object> thread(@PathVariable Long accountId, Authentication auth) {
        UserAccount me = sessions.current(auth);
        List<Message> list = messages.findThread(me.getId(), accountId);
        list.stream().filter(m -> me.getId().equals(m.getToAccountId()) && m.getReadAt() == null).forEach(m -> m.setReadAt(LocalDateTime.now()));
        messages.saveAll(list);
        return Map.of("with", describe(accountId), "canWrite", canWrite(me, accountId), "messages", list.stream().map(m -> Map.of(
                "id", m.getId(), "body", m.getBody(), "at", m.getCreatedAt(), "mine", me.getId().equals(m.getFromAccountId()))).toList());
    }

    public record SendForm(Long toAccountId, String body) {}

    @PostMapping("/messages")
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> send(@RequestBody SendForm f, Authentication auth) {
        UserAccount me = sessions.current(auth);
        String body = f.body() == null ? "" : f.body().trim();
        if (body.isEmpty()) throw new IllegalArgumentException("Écris ton message.");
        if (body.length() > 2000) throw new IllegalArgumentException("Message trop long (2 000 caractères maximum).");
        if (f.toAccountId() == null || !canWrite(me, f.toAccountId())) throw new AccessDeniedException("Tu ne peux pas écrire à ce compte.");
        UserAccount to = accounts.findById(f.toAccountId()).orElseThrow(() -> new NoSuchElementException("Destinataire introuvable"));
        Message m = new Message();
        m.setFromAccountId(me.getId()); m.setToAccountId(to.getId()); m.setBody(body);
        m.setTutorId("TUTOR".equals(me.getRole()) ? me.getTutorId() : to.getTutorId());
        messages.save(m);
        String sender = String.valueOf(describe(me.getId()).get("name"));
        String link = "TUTOR".equals(to.getRole()) ? "/repetiteur/espace#messages" : "/repetiteurs/messages";
        notify.notify(to.getId(), "MESSAGE", "✉️ Nouveau message de " + sender,
                sender + " t'a écrit :\n\n« " + (body.length() > 400 ? body.substring(0, 397) + "…" : body) + " »", link, emailOf(to));
        return Map.of("id", m.getId(), "at", m.getCreatedAt());
    }

    /**
     * Règles d'écriture : un répétiteur peut écrire aux familles qui ont consulté sa fiche (ou qui lui ont écrit) ;
     * un parent ou un élève peut écrire à un répétiteur visible dans l'annuaire, ou poursuivre une conversation existante.
     */
    private boolean canWrite(UserAccount me, Long otherId) {
        if (me.getId().equals(otherId)) return false;
        UserAccount other = accounts.findById(otherId).orElse(null);
        if (other == null) return false;
        boolean existing = messages.existsByFromAccountIdAndToAccountId(otherId, me.getId()) || messages.existsByFromAccountIdAndToAccountId(me.getId(), otherId);
        if ("TUTOR".equals(me.getRole())) {
            if (!"PARENT".equals(other.getRole()) && !"STUDENT".equals(other.getRole())) return false;
            return existing || (me.getTutorId() != null && visits.existsByTutorIdAndVisitorAccountId(me.getTutorId(), otherId));
        }
        if ("PARENT".equals(me.getRole()) || "STUDENT".equals(me.getRole())) {
            if (!"TUTOR".equals(other.getRole())) return false;
            return existing || (other.getTutorId() != null && tutors.findById(other.getTutorId()).map(Tutor::isListed).orElse(false));
        }
        return false;
    }

    private Map<String, Object> describe(Long accountId) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("accountId", accountId);
        UserAccount a = accounts.findById(accountId).orElse(null);
        if (a == null) { m.put("name", "Compte supprimé"); m.put("label", ""); return m; }
        m.put("role", a.getRole());
        if (a.getStudentId() != null) {
            Student s = students.findById(a.getStudentId()).orElse(null);
            m.put("name", s == null ? a.getEmail() : s.getName()); m.put("label", s == null ? "Élève" : "Élève de " + s.getLevel());
        } else if ("TUTOR".equals(a.getRole())) {
            Tutor t = a.getTutorId() == null ? null : tutors.findById(a.getTutorId()).orElse(null);
            m.put("name", a.getFullName()); m.put("label", t == null ? "Répétiteur" : "Répétiteur · " + t.getSpecialties()); m.put("tutorId", a.getTutorId());
        } else {
            m.put("name", a.getFullName() == null ? a.getEmail() : a.getFullName());
            m.put("label", "Parent" + (a.getDistrict() != null ? " · " + a.getDistrict() : a.getCity() != null ? " · " + a.getCity() : ""));
        }
        return m;
    }

    private String emailOf(UserAccount a) {
        if (a.getStudentId() != null) return students.findById(a.getStudentId()).map(s -> s.getParentEmail() != null ? s.getParentEmail() : a.getEmail()).orElse(a.getEmail());
        return a.getEmail();
    }

    // ---------------- Notifications

    @GetMapping("/notifications")
    public Map<String, Object> notifications(Authentication auth) {
        UserAccount me = sessions.current(auth);
        return Map.of("unread", notify.unread(me.getId()), "unreadMessages", messages.countByToAccountIdAndReadAtIsNull(me.getId()),
                "items", notify.latest(me.getId()).stream().map(n -> Map.of("id", n.getId(), "kind", String.valueOf(n.getKind()), "title", n.getTitle(),
                        "body", n.getBody() == null ? "" : n.getBody(), "link", n.getLink() == null ? "" : n.getLink(), "at", n.getCreatedAt(), "read", n.getReadAt() != null)).toList());
    }

    @PostMapping("/notifications/read")
    public Map<String, Object> markRead(Authentication auth) {
        notify.markAllRead(sessions.current(auth).getId());
        return Map.of("ok", true);
    }
}
