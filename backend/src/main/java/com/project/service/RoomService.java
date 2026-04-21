package com.project.service;

import com.project.model.domain.LobbyUser;
import com.project.model.dto.PlayersResponse;
import com.project.model.entity.User;
import com.project.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {
    private final Map<String, List<LobbyUser>> activeRooms = new ConcurrentHashMap<>();
    private final UserRepository userRepository;

    public RoomService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private boolean isActiveRoom(String roomCode) {
        return activeRooms.containsKey(roomCode);
    }

    public void addPlayerToRoom(String roomCode, String username) {
        if (!isActiveRoom(roomCode)) {
            throw new IllegalArgumentException("Room does not exist");
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("Invalid username");
        }

        List<LobbyUser> players = activeRooms.get(roomCode);
        boolean alreadyInRoom = players.stream()
                .anyMatch(p -> p.getUsername().equals(username));

        if (!alreadyInRoom) {
            boolean isHost = players.isEmpty();
            players.add(new LobbyUser(
                    user.getUsername(),
                    user.getAvatar(),
                    false,
                    isHost
            ));
        }
    }

    public String createRoom() {
        String roomCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        activeRooms.put(roomCode, Collections.synchronizedList(new ArrayList<>()));
        return roomCode;
    }

    public PlayersResponse getPlayersInRoom(String roomCode) {
        List<LobbyUser> players = activeRooms.getOrDefault(roomCode, new ArrayList<>());
        return new PlayersResponse(new ArrayList<>(players));
    }

    public void togglePlayerReady(String roomCode, String username) {
        if (!isActiveRoom(roomCode)) {
            throw new IllegalArgumentException("Room does not exist");
        }

        List<LobbyUser> users = activeRooms.get(roomCode);
        for (LobbyUser user: users) {
            if (user.getUsername().equals(username)) {
                user.setIsReady();
                break;
            }
        }
    }

    public void updatePlayerScore(String roomCode, String username, int score) {
        List<LobbyUser> users = activeRooms.get(roomCode);

        for (LobbyUser user: users) {
            if (user.getUsername().equals(username)) {
                user.setScore(score);
                break;
            }
        }
    }
}