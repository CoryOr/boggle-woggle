// MeResponse.java
package com.project.model.dto;

import java.util.UUID;

public record MeResponse(UUID id, String username, String avatar, int highScore, String longestWord, int gamesPlayed) {}