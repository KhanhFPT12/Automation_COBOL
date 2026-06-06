package fa.training.security.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import fa.training.exception.TokenException;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JwtAuthorizationFilter is a Spring Security filter responsible for JWT-based
 * authentication.
 * It extends OncePerRequestFilter to ensure that it's executed only once per
 * request.
 *
 * The filter attempts to retrieve and validate a JWT from the incoming
 * HttpServletRequest.
 * If a valid token is found, it sets the corresponding Authentication in the
 * SecurityContextHolder.
 * In case of token validation failure, a TokenException is caught and logged.
 *
 * This filter is part of the authentication process in a Spring
 * Security-enabled application.
 *
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-14
 */
public class JwtAuthorizationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtProvider jwtProvider;

    /**
     * Performs the actual JWT authentication and validation logic.
     *
     * @param request     The incoming HttpServletRequest.
     * @param response    The outgoing HttpServletResponse.
     * @param filterChain The FilterChain to proceed with the request processing.
     * @throws ServletException if an error occurs during the filter execution.
     * @throws IOException      if an I/O error occurs during the filter execution.
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, java.io.IOException {
        Authentication authentication = jwtProvider.getAuthentication(request);
        try {
            if (authentication != null && jwtProvider.isTokenValid(request)) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (TokenException e) {
            e.printStackTrace();
        }
        filterChain.doFilter(request, response);
    }

}
