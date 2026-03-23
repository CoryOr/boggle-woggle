package com.project.model.dto;

import java.util.UUID;

public record GameResponse(UUID gameId, String[][] board) {}