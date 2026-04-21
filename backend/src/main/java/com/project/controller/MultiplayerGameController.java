package com.project.controller;

import com.project.model.domain.MultiplayerGameState;
import com.project.model.dto.StartGameRequest;
import com.project.model.dto.MultiplayerGuessRequest;
import com.project.service.MultiplayerGameService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class MultiplayerGameController {

    private final MultiplayerGameService multiplayerGameService;
    private final SimpMessagingTemplate messagingTemplate;

    public MultiplayerGameController(MultiplayerGameService multiplayerGameService, SimpMessagingTemplate messagingTemplate) {
        this.multiplayerGameService = multiplayerGameService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Triggered when the Host clicks "Start Game" in the Lobby.
     * Generates the board and broadcasts the initial game state to everyone in the room.
     */
    @MessageMapping("/room.start")
    public void startGame(@Payload StartGameRequest request) {
        // Generate the board and get the initial state
        MultiplayerGameState state = multiplayerGameService.startGameForRoom(request.roomCode());

        // Broadcast it to a new "start" topic that the frontend will listen to
        messagingTemplate.convertAndSend("/room/" + request.roomCode() + "/start", state);
    }

    /**
     * Triggered whenever any player submits a word.
     * Processes the score and broadcasts the updated leaderboard to everyone.
     */
    @MessageMapping("/room.guess")
    public void processGuess(@Payload MultiplayerGuessRequest request, Principal principal) {
        // Principal securely gets the username from their JWT token
        String username = principal.getName();

        // Process the guess and update their score
        MultiplayerGameState updatedState = multiplayerGameService.processMultiplayerGuess(request.roomCode(), username, request.guess());

        // Broadcast the updated scores/board to everyone in the room
        messagingTemplate.convertAndSend("/room/" + request.roomCode() + "/state", updatedState);
    }
}