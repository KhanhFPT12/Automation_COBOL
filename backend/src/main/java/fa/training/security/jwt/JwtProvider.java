package fa.training.security.jwt;

import org.springframework.security.core.Authentication;

import fa.training.exception.TokenException;
import fa.training.model.User;
import fa.training.security.Userprincipal;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

public interface JwtProvider {
    /**
     * Generates a JWT based on the provided Userprincipal authentication details.
     *
     * @param auth The Userprincipal containing user authentication details.
     * @return A JWT string.
     */
    public String generateToken(Userprincipal auth);

    /**
     * Retrieves authentication information from the HttpServletRequest.
     * 
     * @param request The HttpServletRequest containing the token.
     * @return Authentication object representing the user's authentication details.
     */
    public Authentication getAuthentication(HttpServletRequest request);

    /**
     * Extracts JWT claims from the HttpServletRequest.
     * 
     * @param request The HttpServletRequest containing the token.
     * @return Claims object representing the JWT claims.
     */
    public Claims extractClaims(HttpServletRequest request);

    /**
     * Validates the JWT token extracted from the HttpServletRequest.
     * 
     * @param request The HttpServletRequest containing the token.
     * @return True if the token is valid, false otherwise.
     * @throws TokenException If the token is expired.
     */
    public boolean isTokenValid(HttpServletRequest request) throws TokenException;

    /**
     * Generates a JWT token for the given User object.
     * 
     * @param user The User object containing user details.
     * @return A JWT token as a String.
     */
    public String generateTokenFromUser(User user);
}
