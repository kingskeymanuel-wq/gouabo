package com.edufun.portal.security;

import com.edufun.portal.model.UserAccount;
import com.edufun.portal.repository.UserAccountRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserAccountRepository accounts;
    public CustomUserDetailsService(UserAccountRepository accounts) { this.accounts = accounts; }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount a = accounts.findByEmailIgnoreCase(username.trim())
                .orElseThrow(() -> new UsernameNotFoundException("Compte introuvable"));
        return User.withUsername(a.getEmail())
                .password(a.getPasswordHash())
                .roles(a.getRole())
                .disabled(!a.isEnabled())
                .build();
    }
}
