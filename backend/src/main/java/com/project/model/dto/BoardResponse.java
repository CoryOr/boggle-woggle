package com.project.model.dto;

public class BoardResponse {
  private String[][] board;

  public BoardResponse(String[][] board) {
    this.board = board;
  }

  public String[][] getBoard() {
    return board;
  }
}
