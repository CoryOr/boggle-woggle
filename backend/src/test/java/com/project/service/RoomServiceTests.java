package com.project.service;

import com.project.model.domain.LobbyUser;
import com.project.model.dto.PlayersResponse;
import com.project.model.entity.User;
import com.project.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RoomServiceTests {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RoomService roomService;

    public RoomServiceTests() {
        MockitoAnnotations.openMocks(this);
    }

    @BeforeEach
    void setup() {
        roomService = new RoomService(userRepository);
    }

    /**
     * Tests creating a new room by making sure the roomCode is in the correct format and that the room is initially
     * empty.
     */
    @Test
    void testCreateRoom() {
        String roomCode = roomService.createRoom();

        assert(roomCode != null);
        assert(roomCode.length() == 6);
        PlayersResponse players = roomService.getPlayersInRoom(roomCode);
        assert(players.players().isEmpty());
    }

    /**
     * Tests adding a player to a room that doesn't exist.
     */
    @Test
    void testAddPlayerToNonexistentRoom() {
        String roomCode = "!exist";
        String testUsername = "Username";

        assertThrows(IllegalArgumentException.class, () -> roomService.addPlayerToRoom(roomCode, testUsername));
    }

    @Test
    void testAddPlayerToExistingRoom() {
        String roomCode = roomService.createRoom();
        String testUsername = "Username";

        // Create and mock the test user
        User testUser = new User(testUsername, "password", "avatar");

        when(userRepository.findByUsername(testUsername)).thenReturn(testUser);

        roomService.addPlayerToRoom(roomCode, testUsername);

        List<LobbyUser> players = roomService.getPlayersInRoom(roomCode).players();

        assert(players != null);
        assert(players.size() == 1);
        assert(players.getFirst().getUsername().equals(testUsername));
    }
}
