package com.project.controller;

import com.project.model.dto.JoinRoomRequest;
import com.project.model.dto.PlayersResponse;
import com.project.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;
import java.util.Map;

@Controller
public class RoomController {
    private final SimpMessagingTemplate messagingTemplate;
    private final RoomService roomService;

    public RoomController(SimpMessagingTemplate messagingTemplate, RoomService roomService) {
        this.messagingTemplate = messagingTemplate;
        this.roomService = roomService;
    }

    @GetMapping("/api/room/new")
    @ResponseBody
    public Map<String, String> createRoom(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Must be logged in to create a room");
        }
        String newCode = roomService.createRoom();
        return Map.of("roomCode", newCode);
    }

    @MessageMapping("/room.join")
    public void joinRoom(@Payload JoinRoomRequest request, Principal principal) {
        if (principal == null) {
            return;
        }
        try {
            // Uses  the server-side username from the JWT, not whatever the client sent to prevent people from spoofing
            roomService.addPlayerToRoom(request.roomCode(), principal.getName());
            PlayersResponse players = roomService.getPlayersInRoom(request.roomCode());
            messagingTemplate.convertAndSend("/room/" + request.roomCode(), players);
        } catch (IllegalArgumentException e) {
            System.out.println(e + " " + request.roomCode());
        }
    }
}
