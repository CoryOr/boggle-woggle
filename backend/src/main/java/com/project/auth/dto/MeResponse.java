package com.project.auth.dto;

import java.util.UUID;

public record MeResponse(UUID id, String username) {}