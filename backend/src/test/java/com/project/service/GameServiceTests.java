package com.project.service;

import com.project.model.dto.GameResponse;
import com.project.model.dto.GuessResponse;
import com.project.model.entity.Game;
import com.project.model.entity.GameResult;
import com.project.repository.GameRepository;
import com.project.repository.GameResultRepository;
import com.project.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.lenient;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class GameServiceTests {
    @Mock
    private DictionaryService dictionaryService;

    @Mock
    private GameRepository gameRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private GameResultRepository gameResultRepository;

    @InjectMocks
    private GameService gameService;

    public GameServiceTests() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Initialize the gameService before each test and set its game to a pre-determined game
     * where we know which words are valid.
     */
    @BeforeEach
    void setUp() {
        gameService = new GameService(dictionaryService, gameRepository, userRepository, gameResultRepository);

        // Example game that could be created
        Game mockedGame = new Game(4, "irlnsesetctnjadl");
        mockedGame.setGameId(UUID.randomUUID());
        lenient().when(gameRepository.save(any(Game.class))).thenReturn(mockedGame);
        lenient().when(gameRepository.findById(mockedGame.getGameId())).thenReturn(Optional.of(mockedGame));
    }

    /**
     * Words < 3 letters should be invalid and therefore 0 points
     */
    @Test
    void testLessThanThreeLettersGuess() {
        GameResponse game = gameService.generateNewGame();
        when(dictionaryService.isValidWord(any(String.class))).thenReturn(false);

        GuessResponse response = gameService.processGuess(game.gameId(), "be");
        assert(!response.valid());
        assert(response.score() == 0);
    }

    /**
     * Words that aren't in the dictionary should be invalid and 0 points
     */
    @Test
    void testInvalidWord() {
        GameResponse game = gameService.generateNewGame();
        when(dictionaryService.isValidWord(any(String.class))).thenReturn(false);

        GuessResponse response = gameService.processGuess(game.gameId(), "eiojas");
        assert(!response.valid());
        assert(response.score() == 0);
    }

    /**
     * Test a word that is found in the dictionary but isn't available to get points for on the game board. It
     * should be considered invalid and therefore 0 points.
     */
    @Test
    void testValidEnglishWordButNotOnGameBoard() {
        GameResponse game = gameService.generateNewGame();
        when(dictionaryService.isValidWord(any(String.class))).thenReturn(true);

        GuessResponse response = gameService.processGuess(game.gameId(), "assistance");
        assert(!response.valid());
        assert(response.score() == 0);
    }

    /**
     * 3 letters = valid and 1 point
     */
    @Test
    void testThreeLettersGuess() {
        GameResponse game = gameService.generateNewGame();
        when(dictionaryService.isValidWord(any(String.class))).thenReturn(true);

        GuessResponse response = gameService.processGuess(game.gameId(), "ten");
        assert(response.valid());
        assert(response.score() == 1);
    }

    /**
     * 4 letters = valid and 1 point
     */
    @Test
    void testFourLettersGuess() {
        GameResponse game = gameService.generateNewGame();
        when(dictionaryService.isValidWord(any(String.class))).thenReturn(true);

        GuessResponse response = gameService.processGuess(game.gameId(), "test");
        assert(response.valid());
        assert(response.score() == 1);
    }

    /**
     * 5 letters = valid and 2 points
     */
    @Test
    void testFiveLettersGuess() {
        GameResponse game = gameService.generateNewGame();
        when(dictionaryService.isValidWord(any(String.class))).thenReturn(true);

        GuessResponse response = gameService.processGuess(game.gameId(), "terse");
        assert(response.valid());
        assert(response.score() == 2);
    }

    /**
     * 6 letters = valid and 3 points
     */
    @Test
    void testSixLettersGuess() {
        GameResponse game = gameService.generateNewGame();
        when(dictionaryService.isValidWord(any(String.class))).thenReturn(true);

        GuessResponse response = gameService.processGuess(game.gameId(), "tenses");
        assert(response.valid());
        assert(response.score() == 3);
    }

    /**
     * 7 letters = valid and 5 points
     */
    @Test
    void testSevenLettersGuess() {
        GameResponse game = gameService.generateNewGame();
        when(dictionaryService.isValidWord(any(String.class))).thenReturn(true);

        GuessResponse response = gameService.processGuess(game.gameId(), "tensest");
        assert(response.valid());
        assert(response.score() == 5);
    }

    /**
     * 8+ letters = valid and 11 points
     */
    @Test
    void testEightOrGreaterLettersGuess() {
        GameResponse game = gameService.generateNewGame();
        when(dictionaryService.isValidWord(any(String.class))).thenReturn(true);

        GuessResponse response = gameService.processGuess(game.gameId(), "restates");
        assert(response.valid());
        assert(response.score() == 11);
    }

    /**
     * Saving a game result should increment the user's games played by 1
     */
    @Test
    void testSaveGameResultIncrementsGamesPlayed() {
        com.project.model.entity.User user = new com.project.model.entity.User("alice", "hashedpw", "avatar.png");
        when(userRepository.findByUsername("alice")).thenReturn(user);

        com.project.model.dto.GameResultRequest request = new com.project.model.dto.GameResultRequest(UUID.randomUUID(), 3, java.util.List.of("ten"), Optional.empty());
        gameService.saveGameResult(request, "alice");

        assert(user.getGamesPlayed() == 1);
    }

    /**
     * If the score from this game beats the user's current high score, high score should update
     */
    @Test
    void testSaveGameResultUpdatesHighScore() {
        com.project.model.entity.User user = new com.project.model.entity.User("alice", "hashedpw", "avatar.png");
        user.setHighScore(5);
        when(userRepository.findByUsername("alice")).thenReturn(user);

        com.project.model.dto.GameResultRequest request = new com.project.model.dto.GameResultRequest(UUID.randomUUID(), 99, java.util.List.of("ten"), Optional.empty());
        gameService.saveGameResult(request, "alice");

        assert(user.getHighScore() == 99);
    }

    /**
     * If the user finds a word longer than their current longest word, longest word should update
     */
    @Test
    void testSaveGameResultUpdatesLongestWord() {
        com.project.model.entity.User user = new com.project.model.entity.User("alice", "hashedpw", "avatar.png");
        user.setLongestWord("cat");
        when(userRepository.findByUsername("alice")).thenReturn(user);

        com.project.model.dto.GameResultRequest request = new com.project.model.dto.GameResultRequest(UUID.randomUUID(), 11, java.util.List.of("cat", "restates"), Optional.empty());
        gameService.saveGameResult(request, "alice");

        assert(user.getLongestWord().equals("restates"));
    }
}
