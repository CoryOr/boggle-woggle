package com.project.service;

import com.project.model.dto.AuthResponse;
import com.project.model.dto.LoginRequest;
import com.project.model.dto.MeResponse;
import com.project.model.dto.RegisterRequest;
import com.project.auth.jwt.JwtService;
import com.project.model.entity.User;
import com.project.repository.UserRepository;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public MeResponse register(RegisterRequest req) {
        String username = req.username().trim();

        if (userRepository.findByUsername(username) != null) {
            throw new IllegalArgumentException("Username already taken");
        }

        String hash = passwordEncoder.encode(req.password());
        User saved = userRepository.save(new User(username, hash));

        return new MeResponse(saved.getId(), saved.getUsername());
    }

    public AuthResponse login(LoginRequest req) {
        var authToken = new UsernamePasswordAuthenticationToken(req.username(), req.password());
        authenticationManager.authenticate(authToken); // throws BadCredentialsException if invalid

        String jwt = jwtService.generateToken(req.username().trim());
        return AuthResponse.bearer(jwt);
    }
}