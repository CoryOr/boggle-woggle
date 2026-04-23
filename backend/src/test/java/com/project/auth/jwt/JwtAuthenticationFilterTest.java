package com.project.auth.jwt;

import com.project.auth.security.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtAuthenticationFilterTest {

    @Mock private JwtService jwtService;
    @Mock private CustomUserDetailsService userDetailsService;
    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;
    @Mock private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void doFilter_NoAuthHeader_ContinuesChain() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService);
    }

    @Test
    public void doFilter_ValidToken_SetsAuthentication() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer valid-token");
        when(jwtService.isValid("valid-token")).thenReturn(true);
        when(jwtService.extractUsername("valid-token")).thenReturn("player1");

        UserDetails mockDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("player1")).thenReturn(mockDetails);

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() != null;
    }

    @Test
    public void doFilter_InvalidToken_ContinuesChain() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer invalid-token");
        when(jwtService.isValid("invalid-token")).thenReturn(false);

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() == null;
    }
}