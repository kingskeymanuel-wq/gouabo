package com.edufun.portal.controller;

import com.edufun.portal.model.*;
import com.edufun.portal.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.edufun.portal.repository.UserAccountRepository;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController @RequestMapping("/api")
public class EduFunApiController {
 private final StudentRepository students; private final CourseRepository courses; private final TutorRepository tutors; private final ExamAttemptRepository exams;
 private final LessonRepository lessons; private final VideoResourceRepository videos; private final LessonProgressRepository progress;
 private final QuizRepository quizzes; private final QuizQuestionRepository questions; private final QuizAttemptRepository quizAttempts;
 private final BadgeRepository badges; private final StudentBadgeRepository studentBadges; private final TutorAssignmentRepository assignments;
 @org.springframework.beans.factory.annotation.Autowired private com.edufun.portal.billing.BillingService billing;
 private final ExamSessionRepository examSessions; private final CertificateRepository certificates; private final CurriculumVersionRepository curriculumVersions; private final UserAccountRepository accounts;
 public EduFunApiController(StudentRepository s,CourseRepository c,TutorRepository t,ExamAttemptRepository e,LessonRepository l,VideoResourceRepository v,LessonProgressRepository p,
   QuizRepository q,QuizQuestionRepository qq,QuizAttemptRepository qa,BadgeRepository b,StudentBadgeRepository sb,TutorAssignmentRepository ta,
   ExamSessionRepository es,CertificateRepository cert,CurriculumVersionRepository cv,UserAccountRepository ua){students=s;courses=c;tutors=t;exams=e;lessons=l;videos=v;progress=p;quizzes=q;questions=qq;quizAttempts=qa;badges=b;studentBadges=sb;assignments=ta;examSessions=es;certificates=cert;curriculumVersions=cv;accounts=ua;}
 @GetMapping("/levels") public List<String> levels(){return com.edufun.portal.curriculum.Levels.codes();}
 @GetMapping("/subjects") public Map<String,List<String>> subjects(){Map<String,List<String>> out=new LinkedHashMap<>();com.edufun.portal.curriculum.Levels.all().forEach(l->out.put(l.code(),l.subjects()));return out;}
 /** Catalogue : classes regroupées par cycle, avec le nombre de leçons publiées par discipline. */
 @GetMapping("/catalog") public List<Map<String,Object>> catalog(){Map<String,Map<String,Long>> counts=lessons.findAll().stream().filter(l->"PUBLISHED".equals(l.getStatus())).collect(Collectors.groupingBy(Lesson::getLevel,Collectors.groupingBy(Lesson::getSubject,Collectors.counting())));List<Map<String,Object>> out=new ArrayList<>();for(var l:com.edufun.portal.curriculum.Levels.all()){Map<String,Long> c=counts.getOrDefault(l.code(),Map.of());List<Map<String,Object>> subs=new ArrayList<>();for(String sub:l.subjects())subs.add(Map.of("subject",sub,"lessons",c.getOrDefault(sub,0L)));Map<String,Object> m=new LinkedHashMap<>();m.put("level",l.code());m.put("cycle",l.cycle());m.put("subjects",subs);m.put("lessons",c.values().stream().mapToLong(Long::longValue).sum());out.add(m);}return out;}
 @GetMapping("/dashboard") public Map<String,Object> dashboard(){long pending=tutors.findAll().stream().filter(x->"PENDING".equals(x.getStatus())).count();long approved=tutors.findAll().stream().filter(x->"APPROVED".equals(x.getStatus())).count();long review=exams.findAll().stream().filter(x->"PENDING_REVIEW".equals(x.getStatus())).count();Map<String,Object> out=new LinkedHashMap<>();out.put("students",students.count());out.put("courses",courses.count());out.put("lessons",lessons.count());out.put("videos",videos.count());out.put("approvedTutors",approved);out.put("pendingTutors",pending);out.put("examsToReview",review);out.put("quizzes",quizzes.count());out.put("badges",badges.count());out.put("certificates",certificates.count());out.put("xp",students.findAll().stream().mapToInt(Student::getXp).sum());return out;}
 @GetMapping("/students") public List<Student> students(){return students.findAll();}
 @GetMapping("/students/{id}") public Student student(@PathVariable Long id){return students.findById(id).orElseThrow();}
 @PostMapping("/students") @ResponseStatus(HttpStatus.CREATED) public Student studentCreate(@RequestBody Student x){if(x.getStatus()==null)x.setStatus("ACTIVE");return students.save(x);}
 @PatchMapping("/students/{id}/progress") public Student studentProgress(@PathVariable Long id,@RequestParam(defaultValue="0")int xp,@RequestParam(defaultValue="0")int streak, Authentication auth){assertStudentAccess(id,auth);Student x=student(id);x.setXp(Math.max(0,x.getXp()+xp));if(streak>0)x.setStreak(streak);return students.save(x);}
 @DeleteMapping("/students/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deleteStudent(@PathVariable Long id){students.deleteById(id);}
 @GetMapping("/courses") public List<Course> courses(@RequestParam(required=false)String level){return level==null?courses.findAll():courses.findByLevel(level);}
 @GetMapping("/courses/{id}") public Course course(@PathVariable Long id){return courses.findById(id).orElseThrow();}
 @PostMapping("/courses") @ResponseStatus(HttpStatus.CREATED) public Course courseCreate(@RequestBody Course x){if(x.getStatus()==null)x.setStatus("PUBLISHED");return courses.save(x);}
 @PatchMapping("/courses/{id}/publish") public Course publish(@PathVariable Long id){Course x=course(id);x.setStatus("PUBLISHED");return courses.save(x);}
 @DeleteMapping("/courses/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deleteCourse(@PathVariable Long id){courses.deleteById(id);}
 @GetMapping("/tutors") public List<?> tutors(Authentication auth){if(isAdmin(auth))return tutors.findAll();
   // Élèves : uniquement les répétiteurs validés, sans leurs coordonnées.
   return tutors.findAll().stream().filter(t->"APPROVED".equals(t.getStatus())).map(t->Map.of("id",t.getId(),"name",String.valueOf(t.getName()),"specialties",String.valueOf(t.getSpecialties()==null?"":t.getSpecialties()),"levels",String.valueOf(t.getLevels()==null?"":t.getLevels()))).toList();}
 @PostMapping("/tutors") @ResponseStatus(HttpStatus.CREATED) public Tutor tutorCreate(@RequestBody Tutor x){x.setStatus("PENDING");return tutors.save(x);}
 @PatchMapping("/tutors/{id}/approve") public Tutor approve(@PathVariable Long id){Tutor x=tutors.findById(id).orElseThrow();x.setStatus("APPROVED");return tutors.save(x);}
 @PatchMapping("/tutors/{id}/reject") public Tutor reject(@PathVariable Long id){Tutor x=tutors.findById(id).orElseThrow();x.setStatus("REJECTED");return tutors.save(x);}
 @GetMapping("/tutor-assignments") public List<TutorAssignment> assignments(@RequestParam(required=false)Long studentId,@RequestParam(required=false)Long tutorId){if(studentId!=null)return assignments.findByStudentId(studentId);if(tutorId!=null)return assignments.findByTutorId(tutorId);return assignments.findAll();}
 @PostMapping("/tutor-assignments") @ResponseStatus(HttpStatus.CREATED) public TutorAssignment assignTutor(@RequestBody TutorAssignment x){x.setStatus("ACTIVE");return assignments.save(x);}
 @PatchMapping("/tutor-assignments/{id}") public TutorAssignment updateAssignment(@PathVariable Long id,@RequestBody TutorAssignment x){TutorAssignment a=assignments.findById(id).orElseThrow();if(x.getStatus()!=null)a.setStatus(x.getStatus());if(x.getNotes()!=null)a.setNotes(x.getNotes());return assignments.save(a);}
 @GetMapping("/exams") public List<ExamAttempt> exams(){return exams.findAll();}
 @GetMapping("/exams/{id}") public List<ExamAttempt> examsByStudent(@PathVariable Long id, Authentication auth){assertStudentAccess(id,auth);return exams.findByStudentIdOrderByCreatedAtDesc(id);}
 @PostMapping("/exams") @ResponseStatus(HttpStatus.CREATED) public ExamAttempt exam(@RequestBody ExamAttempt x, Authentication auth){assertStudentAccess(x.getStudentId(),auth);x.setStatus("PENDING_REVIEW");x.setCreatedAt(LocalDateTime.now());return exams.save(x);}
 @PatchMapping("/exams/{id}/review") public ExamAttempt review(@PathVariable Long id,@RequestParam int score){ExamAttempt x=exams.findById(id).orElseThrow();x.setScore(score);x.setStatus(score*100/Math.max(1,x.getTotal())>=50?"PASSED":"FAILED");return exams.save(x);}
 @GetMapping("/exam-sessions") public List<ExamSession> examSessions(){return examSessions.findAll();}
 @PostMapping("/exam-sessions") @ResponseStatus(HttpStatus.CREATED) public ExamSession createExamSession(@RequestBody ExamSession x){if(x.getCorrectionDueAt()==null&&x.getEndsAt()!=null)x.setCorrectionDueAt(x.getEndsAt().plusDays(2));if(x.getResultPublishedAt()==null&&x.getEndsAt()!=null)x.setResultPublishedAt(x.getEndsAt().plusDays(2));return examSessions.save(x);}
 @PatchMapping("/exam-sessions/{id}/publish") public ExamSession publishResults(@PathVariable Long id){ExamSession x=examSessions.findById(id).orElseThrow();if(x.getResultPublishedAt()==null||!x.getResultPublishedAt().isAfter(LocalDateTime.now())){x.setStatus("RESULTS_PUBLISHED");x.setResultPublishedAt(LocalDateTime.now());return examSessions.save(x);}throw new IllegalStateException("Les résultats ne sont pas encore à la date de publication prévue.");}
 @GetMapping("/curriculum") public List<Lesson> curriculum(@RequestParam String level,@RequestParam(required=false)String subject){List<Lesson> all=subject==null||subject.isBlank()?lessons.findByLevelOrderByOrderIndexAsc(level):lessons.findByLevelAndSubjectOrderByOrderIndexAsc(level,subject);return all.stream().filter(l->"PUBLISHED".equals(l.getStatus())).toList();}
 @GetMapping("/lessons/{id}") public Lesson lessonRead(@PathVariable Long id, Authentication auth){billing.assertAccess(auth);return lesson(id);}
 private Lesson lesson(Long id){return lessons.findById(id).orElseThrow();}
 @PostMapping("/lessons") @ResponseStatus(HttpStatus.CREATED) public Lesson lessonCreate(@RequestBody Lesson x){return lessons.save(x);}
 @GetMapping("/lessons/{id}/videos") public List<VideoResource> lessonVideos(@PathVariable Long id, Authentication auth){if(isAdmin(auth))return videos.findByLessonId(id);billing.assertAccess(auth);return videos.findByLessonIdAndPublishedTrue(id);}
 @PostMapping("/videos") @ResponseStatus(HttpStatus.CREATED) public VideoResource videoCreate(@RequestBody VideoResource x){lesson(x.getLessonId());x.setStyle("KIDS".equals(x.getStyle())?"KIDS":"PRESENTER");x.setType(x.getUrl()!=null&&x.getUrl().matches("(?i)https?://(www\\.|m\\.)?(youtube(-nocookie)?\\.com|youtu\\.be)/.*")?"YOUTUBE":"VIDEO");x.setCheckpoints(normalizeCheckpoints(x.getCheckpoints()));return videos.save(x);}
 /** « 1:35, 210, 4:05 » → « 95,210,245 » (secondes, croissantes ; un même instant peut porter plusieurs questions). */
 public static String normalizeCheckpoints(String raw){if(raw==null||raw.isBlank())return null;List<Integer> out=new ArrayList<>();for(String part:raw.split("[,;\\s]+")){if(part.isBlank())continue;String[] t=part.split(":");if(t.length>3)throw new IllegalArgumentException("Point de vérification invalide : "+part);int sec=0;try{for(String u:t)sec=sec*60+Integer.parseInt(u.trim());}catch(NumberFormatException e){throw new IllegalArgumentException("Point de vérification invalide : "+part);}if(sec>0)out.add(sec);}return out.isEmpty()?null:out.stream().sorted().map(String::valueOf).collect(Collectors.joining(","));}
 @DeleteMapping("/videos/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void videoDelete(@PathVariable Long id){videos.deleteById(id);}
 @PostMapping("/lessons/{lessonId}/complete") public Map<String,Object> complete(@PathVariable Long lessonId,@RequestParam Long studentId,@RequestParam(defaultValue="100") int score, Authentication auth){assertStudentAccess(studentId,auth);billing.assertAccess(auth);Lesson l=lesson(lessonId);Student s=student(studentId);LessonProgress p=progress.findByStudentIdAndLessonId(studentId,lessonId).orElseGet(LessonProgress::new);if(p.isCompleted())return Map.of("success",true,"alreadyCompleted",true,"xp",s.getXp(),"lesson",l.getTitle());p.setStudentId(studentId);p.setLessonId(lessonId);p.setPercent(Math.max(0,Math.min(100,score)));p.setCompleted(true);p.setXpEarned(20);p.setUpdatedAt(LocalDateTime.now());progress.save(p);s.setXp(s.getXp()+20);s.setStreak(Math.max(1,s.getStreak()));students.save(s);awardEligibleBadges(s);return Map.of("success",true,"alreadyCompleted",false,"xp",s.getXp(),"lesson",l.getTitle());}
 @GetMapping("/students/{id}/progress") public Map<String,Object> studentLearningProgress(@PathVariable Long id, Authentication auth){assertStudentAccess(id,auth);List<LessonProgress> ps=progress.findByStudentId(id);long done=ps.stream().filter(LessonProgress::isCompleted).count();int xp=ps.stream().mapToInt(LessonProgress::getXpEarned).sum();return Map.of("completedLessons",done,"lessonXp",xp,"records",ps,"badges",studentBadges.findByStudentId(id));}
 @GetMapping("/program/summary") public Map<String,Object> programSummary(){Map<String,Long> by=lessons.findAll().stream().collect(Collectors.groupingBy(Lesson::getLevel,Collectors.counting()));return Map.of("levels",levels(),"lessonsByLevel",by,"totalLessons",lessons.count(),"totalVideos",videos.count(),"curriculumVersions",curriculumVersions.count());}
 @GetMapping("/curriculum-versions") public List<CurriculumVersion> curriculumVersions(){return curriculumVersions.findAll();}
 @PostMapping("/curriculum-versions") @ResponseStatus(HttpStatus.CREATED) public CurriculumVersion curriculumVersion(@RequestBody CurriculumVersion x){return curriculumVersions.save(x);}
 @GetMapping("/quizzes") public List<Quiz> quizzes(@RequestParam(required=false)String level,@RequestParam(required=false)String subject){return quizzes.findAll();}
 @PostMapping("/quizzes") @ResponseStatus(HttpStatus.CREATED) public Quiz quizCreate(@RequestBody Quiz x){return quizzes.save(x);}
 @GetMapping("/quizzes/{id}") public Map<String,Object> quiz(@PathVariable Long id, Authentication auth){billing.assertAccess(auth);Quiz q=quizzes.findById(id).orElseThrow();List<QuizQuestion> qs=questions.findByQuizIdOrderByOrderIndexAsc(id);if(isAdmin(auth))return Map.of("quiz",q,"questions",qs);
   // Les élèves ne reçoivent jamais les bonnes réponses : la correction se fait côté serveur.
   List<Map<String,Object>> safe=qs.stream().map(x->{Map<String,Object> m=new LinkedHashMap<>();m.put("id",x.getId());m.put("type",x.getType());m.put("question",x.getQuestion());m.put("options",x.getOptions());m.put("points",x.getPoints());return m;}).toList();
   return Map.of("quiz",q,"questions",safe);}
 @PostMapping("/quizzes/{id}/submit") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> quizSubmit(@PathVariable Long id,@RequestBody Map<String,Object> body, Authentication auth){
   Long sid=Long.valueOf(String.valueOf(body.get("studentId")));assertStudentAccess(sid,auth);billing.assertAccess(auth);Quiz q=quizzes.findById(id).orElseThrow();
   Map<?,?> answers=body.get("answers") instanceof Map<?,?> m?m:Map.of();int score=0,total=0;List<Map<String,Object>> review=new ArrayList<>();
   for(QuizQuestion x:questions.findByQuizIdOrderByOrderIndexAsc(id)){int pts=x.getPoints()==null?1:x.getPoints();total+=pts;Object a=answers.get(String.valueOf(x.getId()));boolean ok=a!=null&&String.valueOf(a).trim().equalsIgnoreCase(String.valueOf(x.getCorrectAnswer()).trim());if(ok)score+=pts;review.add(Map.of("questionId",x.getId(),"correct",ok,"correctAnswer",String.valueOf(x.getCorrectAnswer())));}
   QuizAttempt at=new QuizAttempt();at.setQuizId(id);at.setStudentId(sid);at.setScore(score);at.setTotal(total);at.setPassed(score*100/Math.max(1,total)>=q.getPassingScore());at.setAttemptedAt(LocalDateTime.now());QuizAttempt saved=quizAttempts.save(at);
   // XP accordé une seule fois par quiz réussi, pour empêcher de « farmer » en rejouant.
   boolean firstPass=saved.isPassed()&&quizAttempts.findByStudentIdOrderByAttemptedAtDesc(sid).stream().filter(t->t.getQuizId().equals(id)&&t.isPassed()).count()==1;
   if(firstPass){Student s=student(sid);s.setXp(s.getXp()+50);students.save(s);awardEligibleBadges(s);}
   return Map.of("attempt",saved,"xpAwarded",firstPass?50:0,"review",review);}
 @PostMapping("/quizzes/{id}/questions") @ResponseStatus(HttpStatus.CREATED) public QuizQuestion questionCreate(@PathVariable Long id,@RequestBody QuizQuestion x){x.setQuizId(id);return questions.save(x);}
 @PostMapping("/quiz-attempts") @ResponseStatus(HttpStatus.CREATED) public QuizAttempt quizAttempt(@RequestBody QuizAttempt x, Authentication auth){assertStudentAccess(x.getStudentId(),auth);Quiz q=quizzes.findById(x.getQuizId()).orElseThrow();x.setPassed(x.getScore()*100/Math.max(1,x.getTotal())>=q.getPassingScore());x.setAttemptedAt(LocalDateTime.now());QuizAttempt saved=quizAttempts.save(x);if(saved.isPassed()){Student s=student(saved.getStudentId());s.setXp(s.getXp()+50);students.save(s);awardEligibleBadges(s);}return saved;}
 @GetMapping("/students/{id}/quiz-attempts") public List<QuizAttempt> quizAttempts(@PathVariable Long id, Authentication auth){assertStudentAccess(id,auth);return quizAttempts.findByStudentIdOrderByAttemptedAtDesc(id);}
 @GetMapping("/badges") public List<Badge> badges(){return badges.findAll();}
 @PostMapping("/badges") @ResponseStatus(HttpStatus.CREATED) public Badge badgeCreate(@RequestBody Badge x){return badges.save(x);}
 @GetMapping("/students/{id}/badges") public List<StudentBadge> studentBadges(@PathVariable Long id, Authentication auth){assertStudentAccess(id,auth);return studentBadges.findByStudentId(id);}
 @PostMapping("/students/{studentId}/badges/{badgeId}") @ResponseStatus(HttpStatus.CREATED) public StudentBadge awardBadge(@PathVariable Long studentId,@PathVariable Long badgeId){return awardBadgeInternal(studentId,badgeId);}
 @GetMapping("/certificates") public List<Certificate> certificates(@RequestParam(required=false)Long studentId, Authentication auth){if(studentId!=null)assertStudentAccess(studentId,auth);else if(!isAdmin(auth))throw new org.springframework.security.access.AccessDeniedException("Accès réservé à l'administration");return studentId==null?certificates.findAll():certificates.findByStudentId(studentId);}
 @PostMapping("/certificates") @ResponseStatus(HttpStatus.CREATED) public Certificate certificate(@RequestBody Certificate x){if(x.getCertificateNumber()==null)x.setCertificateNumber("EDU-"+UUID.randomUUID().toString().substring(0,8).toUpperCase());if(x.getIssuedAt()==null)x.setIssuedAt(LocalDateTime.now());return certificates.save(x);}
 @GetMapping("/certificates/verify/{number}") public Map<String,Object> verify(@PathVariable String number){return certificates.findByCertificateNumber(number).<Map<String,Object>>map(c->Map.of("valid",true,"certificate",c)).orElse(Map.of("valid",false));}
 private void awardEligibleBadges(Student s){for(Badge b:badges.findAll())if(s.getXp()>=b.getXpRequired()&&!studentBadges.existsByStudentIdAndBadgeId(s.getId(),b.getId()))awardBadgeInternal(s.getId(),b.getId());}
 private StudentBadge awardBadgeInternal(Long sid,Long bid){if(studentBadges.existsByStudentIdAndBadgeId(sid,bid))return studentBadges.findByStudentId(sid).stream().filter(x->x.getBadgeId().equals(bid)).findFirst().orElseThrow();StudentBadge x=new StudentBadge();x.setStudentId(sid);x.setBadgeId(bid);x.setAwardedAt(LocalDateTime.now());return studentBadges.save(x);}
 private boolean isAdmin(Authentication auth){return auth!=null&&auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN"));}
 private void assertStudentAccess(Long id, Authentication auth){
   if(auth==null || !auth.isAuthenticated()) throw new org.springframework.security.access.AccessDeniedException("Connexion requise");
   if(auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN"))) return;
   var account=accounts.findByEmailIgnoreCase(auth.getName()).orElseThrow(()->new org.springframework.security.access.AccessDeniedException("Compte introuvable"));
   if(!"STUDENT".equals(account.getRole()) || !id.equals(account.getStudentId())) throw new org.springframework.security.access.AccessDeniedException("Accès à cet espace refusé");
 }

}
