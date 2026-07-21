package fa.training.util;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.util.StringUtils;

import jakarta.servlet.http.HttpServletRequest;

/**
 * SecurityUtils class provides utility methods related to security operations.
 * 
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-14
 */
public class SecurityUtils {
    /**
     * Prefix for role authorities.
     */
    public static final String ROLE_PREFIX = "ROLE_";
    /**
     * Header name for authorization token.
     */
    public static final String AUTH_HEADER = "authorization";
    /**
     * Token type for authentication.
     */
    public static final String AUTH_TOKEN_TYPE = "Bearer";
    /**
     * Prefix for the authentication token.
     */
    public static final String AUTH_TOKEN_PREFIX = AUTH_TOKEN_TYPE + " ";

    /**
     * Converts a role string to a SimpleGrantedAuthority.
     * 
     * @param role The role to be converted.
     * @return SimpleGrantedAuthority representing the role.
     */
    public static SimpleGrantedAuthority convertToAuthority(String role) {
        String formattedRole = role.startsWith(ROLE_PREFIX) ? role : ROLE_PREFIX + role;
        return new SimpleGrantedAuthority(formattedRole);
    }

     /**
     * Extracts the authentication token from the provided HttpServletRequest.
     * 
     * @param request The HttpServletRequest containing the authorization header.
     * @return The authentication token extracted from the header, or null if not present.
     */
    public static String extractAuthTokenFromRequest(HttpServletRequest request) {

        String bearerToken = request.getHeader(AUTH_HEADER);
        if (StringUtils.hasLength(bearerToken) && bearerToken.startsWith(AUTH_TOKEN_PREFIX)) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
