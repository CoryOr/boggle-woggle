package com.project.service;

import com.project.model.domain.Board;
import com.project.model.dto.GameResponse;

import com.project.model.dto.GuessResponse;
import com.project.model.entity.Game;
import com.project.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameService {
    private final DictionaryService dictionaryService;
    private final GameRepository gameRepository;

    public GameService(DictionaryService dictionaryService, GameRepository gameRepository) {
        this.dictionaryService = dictionaryService;
        this.gameRepository = gameRepository;
    }

    public GameResponse generateNewGame() {
        Board board = new Board();
        String[][] boardLetters = board.getBoard();

        StringBuilder sb = new StringBuilder();
        int n = boardLetters.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                sb.append(boardLetters[i][j]);
            }
        }

        Game saved = gameRepository.save(new Game(boardLetters.length, sb.toString()));

        return new GameResponse(saved.getGameId(), boardLetters);
    }

    public String[][] getCurrentBoard(UUID gameId) {
        Game currentGame = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found: " + gameId));

        String letters = currentGame.getLetters().toLowerCase();
        int size = currentGame.getBoardSize();
        String[][] board = new String[size][size];
        int lettersPointer = 0;

        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                if (letters.charAt(lettersPointer) == 'q') {
                    board[i][j] = letters.substring(lettersPointer, lettersPointer + 2);
                    lettersPointer += 2;
                }
                else {
                    board[i][j] = String.valueOf(letters.charAt(lettersPointer));
                    lettersPointer++;
                }
            }
        }

        return board;
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private boolean canFormWord(String[][] board, String word) {
        int size = board.length;

        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                if (dfs(board, word, i, j, 0, new boolean[size][size])) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean dfs(String[][] board, String word, int row, int col, int index, boolean[][] visited) {
        if (index == word.length()) return true;

        int size = board.length;
        if (row < 0 || row >= size || col < 0 || col >= size) return false;
        if (visited[row][col]) return false;

        String current = board[row][col]; // handles "qu" naturally
        if (!word.startsWith(current, index)) return false;

        visited[row][col] = true;

        int[][] directions = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        for (int[] dir : directions) {
            if (dfs(board, word, row + dir[0], col + dir[1], index + current.length(), visited)) {
                visited[row][col] = false;
                return true;
            }
        }

        visited[row][col] = false;
        return false;
    }
///  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    public GuessResponse processGuess(UUID gameId, String guess) {
        String[][] board = getCurrentBoard(gameId);

        boolean isWord = dictionaryService.isValidWord(guess);
        boolean canFormWord = canFormWord(board, guess);

        int points = 0;
        if (isWord && canFormWord) {
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

        return new GuessResponse(points, isWord && canFormWord);
    }
}
