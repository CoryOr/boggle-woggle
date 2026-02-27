package com.project.auth.controller;

import com.project.auth.dto.MeResponse;
import com.project.auth.repo.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public MeResponse me(Authentication auth) {
        String username = auth.getName();
        var user = userRepository.findByUsernameIgnoreCase(username).orElseThrow();
        return new MeResponse(user.getId(), user.getUsername());
    }
}