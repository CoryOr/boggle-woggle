package com.project.controller;

import com.project.auth.jwt.JwtService;
import com.project.model.dto.JoinRoomRequest;
import com.project.model.dto.PlayersResponse;
import com.project.model.dto.UpdateReadyRequest;
import com.project.service.RoomService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoomController.class)
@AutoConfigureMockMvc(addFilters = false)
public class RoomControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RoomController roomController;

    @MockitoBean
    private RoomService roomService;

    @MockitoBean
    private SimpMessagingTemplate messagingTemplate;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private com.project.auth.security.CustomUserDetailsService customUserDetailsService;

    /**
     * Tests creating a new room
     * @throws Exception
     */
    @Test
    void testCreateRoomEndpoint() throws Exception {
        String mockedCode = "ABC123D";
        when(roomService.createRoom()).thenReturn(mockedCode);

        mockMvc.perform(get("/api/room/new"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomCode").value(mockedCode));
    }

    /**
     * Tests joining an existing room
     */
    @Test
    void testJoinRoomWebSocketLogic() {
        String roomCode = "ABC123D";
        String username = "username";
        JoinRoomRequest request = new JoinRoomRequest(roomCode, username);
        PlayersResponse mockResponse = new PlayersResponse(new ArrayList<>());

        when(roomService.getPlayersInRoom(roomCode)).thenReturn(mockResponse);

        roomController.joinRoom(request);

        verify(roomService).addPlayerToRoom(roomCode, username);

        verify(messagingTemplate).convertAndSend(eq("/room/" + roomCode), eq(mockResponse));
    }

    /**
     * Tests trying to join a room that doesn't exist
     */
    @Test
    void testJoinRoomHandlesException() {
        JoinRoomRequest request = new JoinRoomRequest("INVALID", "User");
        when(roomService.getPlayersInRoom(anyString())).thenThrow(new IllegalArgumentException("Room not found"));

        roomController.joinRoom(request);
        verify(roomService).addPlayerToRoom("INVALID", "User");
    }

    @Test
    void testToggleUserReady() {
        String roomCode = "ABC123D";
        String username = "testUser";
        UpdateReadyRequest request = new UpdateReadyRequest(roomCode, username);

        PlayersResponse mockResponse = new PlayersResponse(new ArrayList<>());
        when(roomService.getPlayersInRoom(roomCode)).thenReturn(mockResponse);

        roomController.toggleReady(request);

        verify(roomService).togglePlayerReady(roomCode, username);

        verify(messagingTemplate).convertAndSend(eq("/room/" + roomCode), eq(mockResponse));
    }
}