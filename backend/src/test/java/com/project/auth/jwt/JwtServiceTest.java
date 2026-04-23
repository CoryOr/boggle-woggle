package com.project.auth.jwt;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    // Must be at least 32 characters as required by the constructor
    private final String validSecret = "this-is-a-very-long-secret-key-for-testing-jwt-12345";

    @Test
    public void constructor_ShortSecret_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            new JwtService("short", 3600);
        });
    }

    @Test
    public void generateAndExtractToken_Valid_Success() {
        // Arrange
        JwtService jwtService = new JwtService(validSecret, 3600);

        // Act
        String token = jwtService.generateToken("player1");

        // Assert
        assertNotNull(token);
        assertTrue(jwtService.isValid(token));
        assertEquals("player1", jwtService.extractUsername(token));
    }

    @Test
    public void isValid_InvalidToken_ReturnsFalse() {
        // Arrange
        JwtService jwtService = new JwtService(validSecret, 3600);

        // Act & Assert
        assertFalse(jwtService.isValid("this.is.notatoken"));
    }
}