// UserController.java
package com.project.controller;

import com.project.model.dto.MeResponse;
import com.project.model.entity.User;
import com.project.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return new MeResponse(
                user.getId(),
                user.getUsername(),
                user.getAvatar(),
                user.getHighScore(),
                user.getLongestWord(),
                user.getGamesPlayed()
        );
    }
}