package com.project.controller;

import com.project.auth.jwt.JwtService;
import com.project.model.domain.LobbyUser;
import com.project.model.dto.GameResponse;
import com.project.model.dto.GuessResponse;
import com.project.model.dto.PlayersResponse;
import com.project.service.GameService;
import com.project.service.RoomService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GameController.class)
@AutoConfigureMockMvc(addFilters = false)
public class GameControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private com.project.auth.security.CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    private GameService gameService;

    @MockitoBean
    private RoomService roomService;

    @Test
    void testNewGameEndpoint() throws Exception {
        UUID mockedUUID = UUID.randomUUID();

        when(gameService.generateNewGame()).thenReturn(new GameResponse(
                mockedUUID,
                new String[][] {
                    {"a", "a", "a", "a"},
                    {"a", "a", "a", "a"},
                    {"a", "a", "a", "a"},
                    {"a", "a", "a", "a"}
                }
        ));

        mockMvc.perform(get("/api/game/new"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameId").value(mockedUUID.toString()))
                .andExpect(jsonPath("$.board").isArray())
                .andExpect(jsonPath("$.board[0]").isArray())
                .andExpect(jsonPath("$.board.length()").value(4))
                .andExpect(jsonPath("$.board[0].length()").value(4))
                .andExpect(jsonPath("$.board[0][0]").value("a"));
    }

    @Test
    void testSubmitGuessEndpoint() throws Exception {
        when(gameService.processGuess(org.mockito.ArgumentMatchers.any(java.util.UUID.class), anyString()))
                .thenReturn(new GuessResponse(0, false));

        mockMvc.perform(post("/api/game/guess")
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .content("{\"gameId\":\"" + java.util.UUID.randomUUID() + "\", \"guess\":\"testGuess\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(0))
                .andExpect(jsonPath("$.valid").value(false));
    }

    @Test
    void testGetPlayersEndpoint() throws Exception {
        when(roomService.getPlayersInRoom(anyString()))
                .thenReturn(new PlayersResponse(new java.util.ArrayList<>()));

        String jsonBody = "{\"roomCode\":\"ABC123D\"}";

        mockMvc.perform(post("/api/game/players")
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .content(jsonBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.players").isArray())
                .andExpect(jsonPath("$.players.length()").value(0));
    }
}