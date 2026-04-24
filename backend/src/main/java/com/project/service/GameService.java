package com.project.service;

import com.project.model.domain.Board;
import com.project.model.dto.GameResponse;

import com.project.model.dto.GameResultRequest;
import com.project.model.dto.GuessResponse;
import com.project.model.entity.Game;
import com.project.model.entity.User;
import com.project.model.entity.GameResult;
import com.project.repository.GameRepository;
import com.project.repository.GameResultRepository;
import com.project.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.UUID;

@Service
public class GameService {
    private final DictionaryService dictionaryService;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final GameResultRepository gameResultRepository;



    public GameService(DictionaryService dictionaryService, GameRepository gameRepository, UserRepository userRepository, GameResultRepository gameResultRepository) {
        this.dictionaryService = dictionaryService;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.gameResultRepository = gameResultRepository;
    }

    /**
     * save method inherited in gameRepository generates the UUID for us, so we only need to create the board. Save
     * the game in the Game database table as well. The board is stored as an nvarchar and mapped back out to a 2d array
     * of strings when we need to reference the board again.
     * @return (gameId, board) for the newly created game
     */
    public GameResponse generateNewGame() {
        Board board = new Board();
        String[][] boardLetters = board.getBoard();

        // Convert to a flat 1d string for db saving purposes
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

    /**
     * Used by processGuess method. Gets the current game from the database, maps the board back to a 2d array of
     * strings, and returns the board to be traversed.
     * @param gameId the unique game we care about
     * @return a 2d array of strings representing the current game's board
     *
     * TODO: In the future, this could become a bottleneck for guessing words. We might need to implement some sort of
     * caching later down the line, but in its current state there is no noticeable delay. Guesses are instantaneous
     */
    private String[][] getCurrentBoard(UUID gameId) {
        Game currentGame = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found: " + gameId));

        String letters = currentGame.getLetters().toLowerCase();
        int size = currentGame.getBoardSize();
        String[][] board = new String[size][size];
        int lettersPointer = 0;

        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                // Case where we have a Qu letter tile
                if (letters.charAt(lettersPointer) == 'q') {
                    board[i][j] = letters.substring(lettersPointer, lettersPointer + 2);
                    lettersPointer += 2;
                }
                // Normal case where a letter tile only contains one letter
                else {
                    board[i][j] = String.valueOf(letters.charAt(lettersPointer));
                    lettersPointer++;
                }
            }
        }

        return board;
    }

    /**
     * Checks if word can be formed from the current game's board. For example, "water" is a word, but it might not
     * be present on the current game's board
     * @param board the current game's board
     * @param word the guess the user has made
     * @return true if the guess can be found in the game board
     */
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

    /**
     * dfs algorithm to explore the current board efficiently and determine if word exists in the current game's board
     * @param board the current game's gameboard
     * @param word the user guess
     * @param row current row we are looking through
     * @param col current col we are looking through
     * @param index the current character index in word
     * @param visited tracks which cells have already been visited. We cannot reuse letters on a gameboard
     * @return true if word exists in board
     */
    private boolean dfs(String[][] board, String word, int row, int col, int index, boolean[][] visited) {
        if (index == word.length()) {
            return true;
        }

        int size = board.length;
        if (row < 0 || row >= size || col < 0 || col >= size) {
            return false;
        }
        if (visited[row][col]) {
            return false;
        }

        String current = board[row][col]; // handles "qu" naturally
        if (!word.startsWith(current, index)) {
            return false;
        }

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

    public void saveGameResult(GameResultRequest request, String username) {
        GameResult result = new GameResult(
                username,
                request.gameId(),
                request.score(),
                String.join(",", request.foundWords()),
                false
        );
        gameResultRepository.save(result);

        User user = userRepository.findByUsername(username);
        user.setGamesPlayed(user.getGamesPlayed() + 1);

        if (request.score() > user.getHighScore()) {
            user.setHighScore(request.score());
        }

        if (request.winnerUsername().isPresent() && request.winnerUsername().get().equals(username)) {
            user.setGamesWon(user.getGamesWon() + 1);
        }

        request.foundWords().stream()
                .max(Comparator.comparingInt(String::length))
                .ifPresent(longest -> {
                    if (user.getLongestWord() == null || longest.length() > user.getLongestWord().length()) {
                        user.setLongestWord(longest);
                    }
                });

        userRepository.save(user);
    }
}
