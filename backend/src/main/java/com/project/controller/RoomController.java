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
    public Map<String, String> createRoom() {
        String newCode = roomService.createRoom();
        return Map.of("roomCode", newCode);
    }

    @MessageMapping("/room.join")
    public void joinRoom(@Payload JoinRoomRequest request) {
        try {
            roomService.addPlayerToRoom(request.roomCode(), request.username());
            PlayersResponse players = roomService.getPlayersInRoom(request.roomCode());

            // Broadcast the full list to everyone in the room
            messagingTemplate.convertAndSend("/room/" + request.roomCode(), players);
        }
        catch(IllegalArgumentException e) {
            // TODO: Add something for handling an invalid room request
            System.out.println(e + " " + request.roomCode());
        }
    }
}
