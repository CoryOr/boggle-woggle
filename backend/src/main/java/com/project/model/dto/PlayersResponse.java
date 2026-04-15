package com.project.model.dto;

import com.project.model.domain.LobbyUser;

import java.util.List;

public record PlayersResponse(List<LobbyUser> players) {
}
