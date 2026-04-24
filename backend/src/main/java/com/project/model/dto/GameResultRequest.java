package com.project.model.dto;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

public record GameResultRequest(UUID gameId, int score, List<String> foundWords, Optional<String> winnerUsername) {

}
