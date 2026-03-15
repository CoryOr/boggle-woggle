package com.project.model.dto;

public class GameResponse {
    private String gameId;
    private String[][] board;

  public GameResponse(String gameId, String[][] board) {
      this.gameId = gameId;
      this.board = board;
  }

  public String getGameId() {
      return gameId;
  }

   public String[][] getBoard() {
      return board;
   }
}
