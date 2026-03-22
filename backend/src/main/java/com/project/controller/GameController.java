package com.project.controller;

import com.project.model.dto.GameResponse;
import com.project.service.GameService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}