package com.project.service;

import com.project.auth.jwt.JwtService;
import com.project.model.dto.AuthResponse;
import com.project.model.dto.LoginRequest;
import com.project.model.dto.RegisterRequest;
import com.project.model.entity.User;
import com.project.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public AuthResponse register(RegisterRequest req) {
        String username = req.username().trim();

        if (userRepository.findByUsername(username) != null) {
          throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        if (!ALLOWED_AVATARS.contains(req.avatar())) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid avatar");
        }

        String hash = passwordEncoder.encode(req.password());
        User saved = userRepository.save(new User(username, hash, req.avatar()));

        String jwt = jwtService.generateToken(saved.getUsername());

        return AuthResponse.bearer(
                jwt,
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