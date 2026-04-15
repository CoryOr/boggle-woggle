package com.project.controller;

import com.project.model.dto.*;
import com.project.service.GameService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.project.model.dto.GameResultRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.project.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/game")
public class GameController {
    private final GameService gameService;
    private final RoomService roomService;

    public GameController(GameService gameService, RoomService roomService) {
        this.gameService = gameService;
        this.roomService = roomService;
    }

    /**
     * Each new game has a unique id and a board. Everything else is initialized on the frontend
     * @return (gameId, board)
     */
    @GetMapping("/new")
    public GameResponse newGame() {
        return gameService.generateNewGame();
    }

    /**
     * Guess from the frontend. All guesses from frontend contain only lowercase letters.
     * @param request the frontend request containing (gameId, guess)
     * @return (valid, pointsEarnedForThisGuess). Should be 0 by default if valid is false.
     */
    @PostMapping("/guess")
    public GuessResponse submitGuess(@RequestBody GuessRequest request) {
        return gameService.processGuess(request.gameId(), request.guess());
    }

    /**
     * Saves the result of a completed game for the authenticated user.
     * @param request the frontend request containing (gameId, score, foundWords)
     * @param auth the authenticated user
     */
    @PostMapping("/finish")
    public ResponseEntity<Void> finishGame(@RequestBody GameResultRequest request, Authentication auth) {
        gameService.saveGameResult(request, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/players")
    public PlayersResponse getPlayers(@RequestBody PlayersRequest request) {
        return roomService.getPlayersInRoom(request.roomCode());
    }
}