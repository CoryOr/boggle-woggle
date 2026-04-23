package com.project.controller;

import com.project.model.dto.MeResponse;
import com.project.model.entity.User;
import com.project.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserController userController;

    @Test
    public void me_ValidUser_ReturnsMeResponse() {
        // Arrange
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("player1");

        User mockUser = mock(User.class);
        when(mockUser.getUsername()).thenReturn("player1");
        when(userRepository.findByUsername("player1")).thenReturn(mockUser);

        // Act
        MeResponse response = userController.me(mockAuth);

        // Assert
        assertNotNull(response);
        assertEquals("player1", response.username());
    }

    @Test
    public void me_UserNotFound_ThrowsException() {
        // Arrange
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("ghost");

        when(userRepository.findByUsername("ghost")).thenReturn(null);

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> userController.me(mockAuth));
    }
}