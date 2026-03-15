package com.project.service;

import com.project.model.domain.Board;
import com.project.model.dto.GameResponse;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameService {
    public GameResponse generateNewGame() {
        String gameId = UUID.randomUUID().toString();
        Board board = new Board();

        return new GameResponse(gameId, board.getBoard());
    }
}
