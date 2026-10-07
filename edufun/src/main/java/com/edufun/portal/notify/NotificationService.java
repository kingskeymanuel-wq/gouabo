package com.edufun.portal.notify;

import com.edufun.portal.model.Notification;
import com.edufun.portal.repository.NotificationRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Notifications EduFun : enregistrées pour l'espace de l'utilisateur et, si une adresse est fournie,
 * envoyées par e-mail. Sans serveur SMTP configuré (spring.mail.host), l'e-mail est marqué SKIPPED
 * et reste consultable dans le CRM.
 */
@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notifications;
    private final ObjectProvider<JavaMailSender> mailSender;
    private final String from, siteUrl;
    private final ExecutorService mailPool = Executors.newFixedThreadPool(2);

    public NotificationService(NotificationRepository notifications, ObjectProvider<JavaMailSender> mailSender,
                               @Value("${edufun.mail.from:EduFun <no-reply@edufun.ci>}") String from,
                               @Value("${edufun.site-url:http://localhost:8082}") String siteUrl) {
        this.notifications = notifications; this.mailSender = mailSender; this.from = from; this.siteUrl = siteUrl;
    }

    public boolean mailConfigured() { return mailSender.getIfAvailable() != null; }

    /** Notification dans l'espace du compte, avec copie e-mail facultative. */
    public Notification notify(Long accountId, String kind, String title, String body, String link, String emailTo) {
        Notification n = new Notification();
        n.setAccountId(accountId); n.setKind(kind); n.setTitle(title); n.setBody(body); n.setLink(link);
        if (emailTo != null && emailTo.contains("@")) { n.setEmailTo(emailTo.trim()); n.setEmailStatus(mailConfigured() ? "PENDING" : "SKIPPED"); }
        Notification saved = notifications.save(n);
        if ("PENDING".equals(saved.getEmailStatus())) mailPool.submit(() -> send(saved.getId()));
        return saved;
    }

    /** E-mail seul (par exemple au parent d'un élève, qui n'a pas forcément de compte). */
    public Notification email(String emailTo, String kind, String title, String body, String link) {
        return notify(null, kind, title, body, link, emailTo);
    }

    private void send(Long id) {
        Notification n = notifications.findById(id).orElse(null);
        JavaMailSender sender = mailSender.getIfAvailable();
        if (n == null || sender == null) return;
        try {
            MimeMessage msg = sender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, true, "UTF-8");
            h.setFrom(from); h.setTo(n.getEmailTo()); h.setSubject(n.getTitle());
            h.setText(plain(n), html(n));
            sender.send(msg);
            n.setEmailStatus("SENT");
        } catch (Exception e) {
            log.warn("E-mail non envoyé à {} : {}", n.getEmailTo(), e.getMessage());
            n.setEmailStatus("FAILED");
        }
        notifications.save(n);
    }

    private String plain(Notification n) {
        return n.getTitle() + "\n\n" + n.getBody() + (n.getLink() != null ? "\n\n" + siteUrl + n.getLink() : "") + "\n\n— EduFun";
    }

    private String html(Notification n) {
        String body = esc(n.getBody()).replace("\n", "<br>");
        String button = n.getLink() == null ? "" : "<p style=\"margin:28px 0 0\"><a href=\"" + siteUrl + n.getLink()
                + "\" style=\"background:#5b3df5;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600\">Ouvrir EduFun</a></p>";
        return "<div style=\"background:#f4f6fb;padding:32px 12px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#141a2e\">"
                + "<div style=\"max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e6e9f2\">"
                + "<div style=\"height:5px;background:linear-gradient(90deg,#f77f00 33%,#fff 33% 66%,#009e60 66%)\"></div>"
                + "<div style=\"padding:28px 30px\"><div style=\"font-weight:800;font-size:18px;margin-bottom:18px\">🎓 EduFun</div>"
                + "<h1 style=\"font-size:20px;margin:0 0 14px\">" + esc(n.getTitle()) + "</h1>"
                + "<div style=\"font-size:15px;line-height:1.6;color:#2b3350\">" + body + "</div>" + button + "</div>"
                + "<div style=\"padding:16px 30px;background:#f8f9fc;color:#6b7590;font-size:12px\">EduFun — plateforme éducative ivoirienne. Vous recevez cet e-mail car votre adresse est liée à un compte EduFun.</div>"
                + "</div></div>";
    }

    private static String esc(String s) {
        return s == null ? "" : s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    public List<Notification> latest(Long accountId) { return notifications.findTop50ByAccountIdOrderByCreatedAtDesc(accountId); }
    public long unread(Long accountId) { return notifications.countByAccountIdAndReadAtIsNull(accountId); }

    public void markAllRead(Long accountId) {
        List<Notification> list = notifications.findTop50ByAccountIdOrderByCreatedAtDesc(accountId).stream().filter(n -> n.getReadAt() == null).toList();
        list.forEach(n -> n.setReadAt(LocalDateTime.now()));
        notifications.saveAll(list);
    }
}
