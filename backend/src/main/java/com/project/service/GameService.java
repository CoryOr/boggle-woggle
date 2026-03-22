package com.project.service;

import com.project.model.domain.Board;
import com.project.model.dto.GameResponse;

import com.project.model.dto.GuessResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameService {
    private final DictionaryService dictionaryService;

    public GameService(DictionaryService dictionaryService) {
        this.dictionaryService = dictionaryService;
    }

    public GameResponse generateNewGame() {
        String gameId = UUID.randomUUID().toString();
        Board board = new Board();

        return new GameResponse(gameId, board.getBoard());
    }

    /**
     * Validates if it is possible to get this word with the given board. Also does point calculation
     *
     * Point Calculation:
     * 0-2 letters: 0 points (automatically considered not a word by dictionaryService.java)
     * 3-4 letters: 1 point
     * 5 letters: 2 points
     * 6 letters: 3 points
     * 7 letters: 5 points
     * 8+ letters: 11 points
     *
     * @param guess the trimmed guess from the frontend as a string
     * @return a GuessResponse with a valid indicator and a score
     */
    public GuessResponse processGuess(String guess) {
        boolean isWord = dictionaryService.isValidWord(guess);

        // TODO: Validate if it is possible to get that word with the current game board

        int points = 0;
        if (isWord) {
            int length = guess.length();
            if (length == 3 || length == 4) {
                points = 1;
            }
            else if (length == 5) {
                points = 2;
            }
            else if (length == 6) {
                points = 3;
            }
            else if (length == 7) {
                points = 5;
            }
            else {
                points = 11;
            }
        }

        return new GuessResponse(points, isWord);
    }
}
