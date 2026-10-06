package com.edufun.portal.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,String> badRequest(IllegalArgumentException e){ return Map.of("message", e.getMessage() == null ? "Requête invalide" : e.getMessage()); }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String,String> conflict(IllegalStateException e){ return Map.of("message", e.getMessage() == null ? "Opération impossible" : e.getMessage()); }
}
