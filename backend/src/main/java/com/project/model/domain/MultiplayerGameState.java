package com.project.model.domain;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class MultiplayerGameState {
    private UUID gameId;
    private String[][] board;
    // Maps a username to their current score
    private Map<String, Integer> playerScores;
    // Maps a username to a list of words they have already found
    private Map<String, java.util.List<String>> playerFoundWords;

    public MultiplayerGameState(UUID gameId, String[][] board) {
        this.gameId = gameId;
        this.board = board;
        this.playerScores = new ConcurrentHashMap<>();
        this.playerFoundWords = new ConcurrentHashMap<>();
    }

    public UUID getGameId() { return gameId; }
    public String[][] getBoard() { return board; }
    public Map<String, Integer> getPlayerScores() { return playerScores; }
    public Map<String, java.util.List<String>> getPlayerFoundWords() { return playerFoundWords; }
}