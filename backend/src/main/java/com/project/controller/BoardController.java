package com.project.controller;

import com.project.model.dto.BoardResponse;
import com.project.model.entity.Board;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/board")
@CrossOrigin(origins = "http://localhost:5173")
public class BoardController {
  @GetMapping("/new")
  public BoardResponse newBoard() {
    Board board = new Board();
    return new BoardResponse(board.getBoard());
  }
}