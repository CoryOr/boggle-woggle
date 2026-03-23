package com.project.controller;

import com.project.model.dto.GameResponse;
import com.project.model.dto.GuessRequest;
import com.project.model.dto.GuessResponse;
import com.project.service.GameService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/game")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/new")
    public GameResponse newGame() {
        return gameService.generateNewGame();
    }

    @PostMapping("/guess")
    public GuessResponse submitGuess(@RequestBody GuessRequest request) {
        return gameService.processGuess(request.gameId(), request.guess());
    }
}