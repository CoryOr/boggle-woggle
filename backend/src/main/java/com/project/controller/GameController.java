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
}