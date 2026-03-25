package com.project.model.dto;

import java.util.UUID;

public record AuthResponse(String accessToken, String tokenType, UUID id, String username, int highScore, String longestWord, int gamesPlayed) {
    public static AuthResponse bearer(String token, UUID id, String username, int highScore, String longestWord, int gamesPlayed) {
        return new AuthResponse(token, "Bearer", id, username, highScore, longestWord, gamesPlayed);
    }
}