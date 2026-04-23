package com.project.service;

import com.project.auth.jwt.JwtService;
import com.project.model.dto.AuthResponse;
import com.project.model.dto.RegisterRequest;
import com.project.model.entity.User;
import com.project.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_ShouldReturnAuthResponse_WhenUsernameIsAvailable() {
        RegisterRequest request = new RegisterRequest(
                "testuser",
                "password123",
                "/Cow_Avatar.png"
        );

        User savedUser = new User("testuser", "hashedPassword", "/Cow_Avatar.png");

        when(userRepository.findByUsername("testuser")).thenReturn(null);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken("testuser")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("testuser", response.username());
        assertEquals("/Cow_Avatar.png", response.avatar());

        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode("password123");
        verify(jwtService, times(1)).generateToken("testuser");
    }

    @Test
    void register_DuplicateUsername_ThrowsException() {
        RegisterRequest req = org.mockito.Mockito.mock(RegisterRequest.class);
        when(req.username()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(new User());

        org.junit.jupiter.api.Assertions.assertThrows(
                org.springframework.web.server.ResponseStatusException.class,
                () -> authService.register(req)
        );
    }

    @Test
    void register_InvalidAvatar_ThrowsException() {
        RegisterRequest req = org.mockito.Mockito.mock(RegisterRequest.class);
        when(req.username()).thenReturn("testuser");
        when(req.avatar()).thenReturn("/Hacker_Avatar.png"); // Not in allowed list
        when(userRepository.findByUsername("testuser")).thenReturn(null);

        org.junit.jupiter.api.Assertions.assertThrows(
                org.springframework.web.server.ResponseStatusException.class,
                () -> authService.register(req)
        );
    }

    @Test
    void login_ValidRequest_ReturnsAuthResponse() {
        com.project.model.dto.LoginRequest req = org.mockito.Mockito.mock(com.project.model.dto.LoginRequest.class);
        when(req.username()).thenReturn("testuser");
        when(req.password()).thenReturn("password123");

        User mockUser = org.mockito.Mockito.mock(User.class);
        when(mockUser.getUsername()).thenReturn("testuser");

        when(userRepository.findByUsername("testuser")).thenReturn(mockUser);
        when(jwtService.generateToken("testuser")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(req);

        assertNotNull(response);
        verify(authenticationManager, times(1)).authenticate(any());
    }
}