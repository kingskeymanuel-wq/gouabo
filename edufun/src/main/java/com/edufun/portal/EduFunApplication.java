package com.edufun.portal; import org.springframework.boot.SpringApplication; import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; @SpringBootApplication
@EnableScheduling public class EduFunApplication { public static void main(String[] args){SpringApplication.run(EduFunApplication.class,args);} }