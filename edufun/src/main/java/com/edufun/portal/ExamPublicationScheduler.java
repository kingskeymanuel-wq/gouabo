package com.edufun.portal;
import com.edufun.portal.model.ExamAttempt;
import com.edufun.portal.model.ExamSession;
import com.edufun.portal.repository.ExamAttemptRepository;
import com.edufun.portal.repository.ExamSessionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
@Component public class ExamPublicationScheduler {
 private final ExamAttemptRepository attempts; private final ExamSessionRepository sessions;
 public ExamPublicationScheduler(ExamAttemptRepository a, ExamSessionRepository s){attempts=a;sessions=s;}
 @Scheduled(fixedDelay=60000)
 public void publishDueResults(){ LocalDateTime now=LocalDateTime.now(); for(ExamAttempt a:attempts.findAll()){ if("PASSED".equals(a.getStatus())||"FAILED".equals(a.getStatus())){ if(a.getCreatedAt()!=null && !a.getCreatedAt().plusDays(2).isAfter(now)){a.setStatus("RESULTS_PUBLISHED");a.setResultPublishedAt(now);attempts.save(a);} } } for(ExamSession s:sessions.findAll()){ if(s.getCorrectionDueAt()!=null && !s.getCorrectionDueAt().isAfter(now) && "SCHEDULED".equals(s.getStatus())){s.setStatus("CORRECTION_DUE");sessions.save(s);} if(s.getResultPublishedAt()!=null && !s.getResultPublishedAt().isAfter(now) && !"RESULTS_PUBLISHED".equals(s.getStatus())){s.setStatus("RESULTS_PUBLISHED");sessions.save(s);} } }
}
