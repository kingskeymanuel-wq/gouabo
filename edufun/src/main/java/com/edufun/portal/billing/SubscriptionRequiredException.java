package com.edufun.portal.billing;

/** Contenu réservé aux abonnés : renvoyé au client en HTTP 402. */
public class SubscriptionRequiredException extends RuntimeException {
    public SubscriptionRequiredException() { super("Ton abonnement EduFun est arrivé à échéance. Renouvelle-le pour continuer à apprendre."); }
}
