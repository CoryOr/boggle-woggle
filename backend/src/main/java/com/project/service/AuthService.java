// AuthService.java
package com.project.service;

import com.project.auth.jwt.JwtService;
import com.project.model.dto.AuthResponse;
import com.project.model.dto.LoginRequest;
import com.project.model.dto.MeResponse;
import com.project.model.dto.RegisterRequest;
import com.project.model.entity.User;
import com.project.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    private static final Set<String> ALLOWED_AVATARS = Set.of(
            "/Assassin_Avatar.png",
            "/Cow_Avatar.png",
            "/Xbox360_Avatar_Background_Removed.png",
            "/Xbox360_Smile_Avatar_Background_Removed.png"
    );

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

        if (req.avatar() == null || req.avatar().isBlank()) {
            throw new IllegalArgumentException("Avatar is required");
        }

        if (!ALLOWED_AVATARS.contains(req.avatar())) {
            throw new IllegalArgumentException("Invalid avatar");
        }

        String hash = passwordEncoder.encode(req.password());
        User saved = userRepository.save(new User(username, hash, req.avatar()));

        return new MeResponse(
                saved.getId(),
                saved.getUsername(),
                saved.getAvatar(),
                saved.getHighScore(),
                saved.getLongestWord(),
                saved.getGamesPlayed()
        );
    }

    public AuthResponse login(LoginRequest req) {
        String username = req.username().trim();

        var authToken = new UsernamePasswordAuthenticationToken(username, req.password());
        authenticationManager.authenticate(authToken);

        User user = userRepository.findByUsername(username);

        String jwt = jwtService.generateToken(username);

        return AuthResponse.bearer(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getAvatar(),
                user.getHighScore(),
                user.getLongestWord(),
                user.getGamesPlayed()
        );
    }
}