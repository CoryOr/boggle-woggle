package com.project.controller;

import com.project.model.domain.MultiplayerGameState;
import com.project.model.dto.StartGameRequest;
import com.project.model.dto.MultiplayerGuessRequest;
import com.project.service.MultiplayerGameService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.security.Principal;
import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MultiplayerGameControllerTest {

    @Mock
    private MultiplayerGameService multiplayerGameService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private MultiplayerGameController multiplayerGameController;

    @Test
    public void startGame_ShouldGenerateBoardAndBroadcast() {
        // Arrange
        String roomCode = "ROOM1";
        StartGameRequest request = new StartGameRequest(roomCode);
        MultiplayerGameState mockState = new MultiplayerGameState(UUID.randomUUID(), new String[][]{});

        when(multiplayerGameService.startGameForRoom(roomCode)).thenReturn(mockState);

        // Act
        multiplayerGameController.startGame(request);

        // Assert
        verify(multiplayerGameService, times(1)).startGameForRoom(roomCode);
        verify(messagingTemplate, times(1)).convertAndSend("/room/ROOM1/start", mockState);
    }

    @Test
    public void processGuess_ShouldUpdateStateAndBroadcast() {
        // Arrange
        String roomCode = "ROOM1";
        String username = "player1";
        String guess = "APPLE";
        MultiplayerGuessRequest request = new MultiplayerGuessRequest(roomCode, guess);
        MultiplayerGameState mockState = new MultiplayerGameState(UUID.randomUUID(), new String[][]{});

        Principal mockPrincipal = mock(Principal.class);
        when(mockPrincipal.getName()).thenReturn(username);

        when(multiplayerGameService.processMultiplayerGuess(roomCode, username, guess)).thenReturn(mockState);

        // Act
        multiplayerGameController.processGuess(request, mockPrincipal);

        // Assert
        verify(multiplayerGameService, times(1)).processMultiplayerGuess(roomCode, username, guess);
        verify(messagingTemplate, times(1)).convertAndSend("/room/ROOM1/state", mockState);
    }
}