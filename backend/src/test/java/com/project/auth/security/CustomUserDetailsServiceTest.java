package com.project.auth.security;

import com.project.model.entity.User;
import com.project.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    public void loadUserByUsername_UserExists_ReturnsUserDetails() {
        // Arrange
        User mockUser = mock(User.class);
        when(mockUser.getUsername()).thenReturn("player1");
        when(mockUser.getPasswordHash()).thenReturn("hashedPass");
        when(userRepository.findByUsername("player1")).thenReturn(mockUser);

        // Act
        UserDetails result = customUserDetailsService.loadUserByUsername("player1");

        // Assert
        assertNotNull(result);
        assertEquals("player1", result.getUsername());
        assertEquals("hashedPass", result.getPassword());
        assertTrue(result.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }

    @Test
    public void loadUserByUsername_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUsername("ghost")).thenReturn(null);

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> customUserDetailsService.loadUserByUsername("ghost"));
    }
}