package com.project.controller;

import com.project.model.domain.LobbyUser;
import com.project.model.dto.JoinRoomRequest;
import com.project.model.dto.PlayersResponse;
import com.project.service.RoomService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RoomControllerTest {

    @Mock
    private RoomService roomService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private RoomController roomController;

    @Test
    public void createRoom_ShouldReturnNewRoomCode() {
        // Arrange
        when(roomService.createRoom()).thenReturn("ABCD");

        // Act
        Map<String, String> response = roomController.createRoom();

        // Assert
        assertEquals("ABCD", response.get("roomCode"));
        verify(roomService, times(1)).createRoom();
    }

    @Test
    public void joinRoom_ValidRequest_ShouldAddPlayerAndBroadcast() {
        // Arrange
        String roomCode = "ABCD";
        String username = "player1";
        JoinRoomRequest request = new JoinRoomRequest(roomCode, username);
        PlayersResponse mockResponse = new PlayersResponse(List.of());

        when(roomService.getPlayersInRoom(roomCode)).thenReturn(mockResponse);

        // Act
        roomController.joinRoom(request);

        // Assert
        verify(roomService, times(1)).addPlayerToRoom(roomCode, username);
        verify(messagingTemplate, times(1)).convertAndSend("/room/ABCD", mockResponse);
    }

    @Test
    public void joinRoom_InvalidRoom_ShouldCatchExceptionAndNotBroadcast() {
        // Arrange
        JoinRoomRequest request = new JoinRoomRequest("INVALID", "player1");
        doThrow(new IllegalArgumentException("Invalid room")).when(roomService).addPlayerToRoom(any(), any());

        // Act
        roomController.joinRoom(request);

        // Assert
        verify(messagingTemplate, never()).convertAndSend(anyString(), any(Object.class));
    }

    @Test
    public void toggleReady_ValidPayload_ShouldToggleAndBroadcast() {
        // Arrange
        Map<String, String> payload = new HashMap<>();
        payload.put("roomCode", "ABCD");
        payload.put("username", "player1");

        PlayersResponse mockResponse = new PlayersResponse(List.of());
        when(roomService.getPlayersInRoom("ABCD")).thenReturn(mockResponse);

        // Act
        roomController.toggleReady(payload);

        // Assert
        verify(roomService, times(1)).togglePlayerReady("ABCD", "player1");
        verify(messagingTemplate, times(1)).convertAndSend("/room/ABCD", mockResponse);
    }
}