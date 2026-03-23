package com.project.model.dto;

import java.util.UUID;

public record GuessRequest(UUID gameId, String guess) {
}
