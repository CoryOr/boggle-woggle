package com.project.service;

import com.project.model.domain.MultiplayerGameState;
import com.project.model.dto.GameResponse;
import com.project.model.dto.GuessResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MultiplayerGameService {

    // Maps a roomCode to its active GameState
    private final Map<String, MultiplayerGameState> activeGames = new ConcurrentHashMap<>();
    private final GameService gameService;

    public MultiplayerGameService(GameService gameService) {
        this.gameService = gameService;
    }

    /**
     * Called when the host clicks "Start Game".
     * Uses existing GameService to generate a board, then saves it to the room.
     */
    public MultiplayerGameState startGameForRoom(String roomCode) {
        // Generate a brand new board
        GameResponse newGame = gameService.generateNewGame();

        // 2. Create the multiplayer state tracker
        MultiplayerGameState state = new MultiplayerGameState(newGame.gameId(), newGame.board());

        // Save it to  active games map
        activeGames.put(roomCode, state);

        return state;
    }

    public MultiplayerGameState getGameState(String roomCode) {
        return activeGames.get(roomCode);
    }

    /**
     * Processes a guess for a specific player in a specific room.
     */
    public MultiplayerGameState processMultiplayerGuess(String roomCode, String username, String guess) {
        MultiplayerGameState state = activeGames.get(roomCode);
        if (state == null) {
            throw new IllegalArgumentException("No active game for this room");
        }

        state.getPlayerScores().putIfAbsent(username, 0);
        state.getPlayerFoundWords().putIfAbsent(username, new ArrayList<>());

        if (state.getPlayerFoundWords().get(username).contains(guess)) {
            return state; // Ignore duplicate guess
        }

        GuessResponse response = gameService.processGuess(state.getGameId(), guess);

        if (response.valid()) {
            int currentScore = state.getPlayerScores().get(username);
            state.getPlayerScores().put(username, currentScore + response.score());
            state.getPlayerFoundWords().get(username).add(guess);
        }

        return state;
    }
}