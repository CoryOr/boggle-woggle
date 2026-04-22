package com.project.controller;

import com.project.model.domain.LobbyUser;
import com.project.model.domain.MultiplayerGameState;
import com.project.model.dto.JoinRoomRequest;
import com.project.model.dto.PlayersResponse;
import com.project.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

@Controller
public class RoomController {

    private static final Logger log = LoggerFactory.getLogger(RoomController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomService roomService;

    public RoomController(SimpMessagingTemplate messagingTemplate, RoomService roomService) {
        this.messagingTemplate = messagingTemplate;
        this.roomService = roomService;
    }

    @MessageExceptionHandler
    public void handleException(Exception e) {
        log.error("🚨 CAUGHT SILENT WEBSOCKET ERROR: ", e);
    }

    @GetMapping("/api/room/new")
    @ResponseBody
    public Map<String, String> createRoom() {
        String newCode = roomService.createRoom();
        return Map.of("roomCode", newCode);
    }

    @MessageMapping("/room.join")
    public void joinRoom(@Payload JoinRoomRequest request) {
        try {
            roomService.addPlayerToRoom(request.roomCode(), request.username());
            PlayersResponse players = roomService.getPlayersInRoom(request.roomCode());
            messagingTemplate.convertAndSend("/room/" + request.roomCode(), players);
        }
        catch(IllegalArgumentException e) {
            log.warn("Room join failed: {}", request.roomCode(), e);
        }
    }

    @MessageMapping("/room.toggle-ready")
    public void toggleReady(@Payload Map<String, String> payload) {
        log.info(" LOGGER BYPASS! RAW JSON RECEIVED: {}", payload);
        try {
            String roomCode = payload.get("roomCode");
            String username = payload.get("username");

            log.info("Sending to RoomService -> Room: {}, User: {}", roomCode, username);
            roomService.togglePlayerReady(roomCode, username);

            log.info("Fetching updated players...");
            PlayersResponse players = roomService.getPlayersInRoom(roomCode);

            log.info("Broadcasting back to frontend!");
            messagingTemplate.convertAndSend("/room/" + roomCode, players);
        }
        catch (Exception e) {
            log.error("Error with toggling ready state!", e);
        }
    }

    @MessageMapping("/room.score")
    public void updatePlayerScore(@Payload Map<String, String> payload) {
        try {
            String roomCode = payload.get("roomCode");
            String username = payload.get("username");
            int score = Integer.parseInt(payload.get("score"));

            roomService.updatePlayerScore(roomCode, username, score);

            List<LobbyUser> players = roomService.getPlayersInRoom(roomCode).players();
            Map<String, Integer> playerScores = new HashMap<>();
            Map<String, java.util.List<String>> playerFoundWords = new HashMap<>();

            for (LobbyUser user : players) {
                playerScores.put(user.getUsername(), user.getScore());
                playerFoundWords.put(user.getUsername(), new ArrayList<>());
            }

            MultiplayerGameState gameState = new MultiplayerGameState(UUID.randomUUID(), new String[][]{});
            gameState.getPlayerScores().putAll(playerScores);
            gameState.getPlayerFoundWords().putAll(playerFoundWords);

            messagingTemplate.convertAndSend("/room/" + roomCode + "/state", gameState);
        } catch (Exception e) {
            log.error("Error updating player score:", e);
        }
    }
}