package com.project.model.dto;

import java.util.List;
import java.util.UUID;

public record GameResultRequest(UUID gameId, int score, List<String> foundWords) {

}
