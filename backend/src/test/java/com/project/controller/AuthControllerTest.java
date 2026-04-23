package com.project.controller;

import com.project.model.dto.AuthResponse;
import com.project.model.dto.LoginRequest;
import com.project.model.dto.RegisterRequest;
import com.project.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    public void register_ShouldReturnOkWithAuthResponse() {
        // Arrange
        RegisterRequest mockRequest = mock(RegisterRequest.class);
        AuthResponse mockResponse = mock(AuthResponse.class);
        when(authService.register(mockRequest)).thenReturn(mockResponse);

        // Act
        ResponseEntity<AuthResponse> result = authController.register(mockRequest);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(mockResponse, result.getBody());
        verify(authService, times(1)).register(mockRequest);
    }

    @Test
    public void login_ShouldReturnOkWithAuthResponse() {
        // Arrange
        LoginRequest mockRequest = mock(LoginRequest.class);
        AuthResponse mockResponse = mock(AuthResponse.class);
        when(authService.login(mockRequest)).thenReturn(mockResponse);

        // Act
        ResponseEntity<AuthResponse> result = authController.login(mockRequest);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(mockResponse, result.getBody());
        verify(authService, times(1)).login(mockRequest);
    }
}