package fa.training.service;

import fa.training.dto.request.UserLoginDTO;
import fa.training.exception.TokenException;
import fa.training.model.User;

/**
 * AuthenticationService is responsible for handling user authentication processes,
 * 
 * @author KhangNV19
 */
public interface AuthenticationService {
    /**
     * Signs in the user by authenticating credentials and generating JWT and refresh tokens.
     * 
     * @param user The User object containing username and password for authentication.
     * @return The signed-in User object with JWT and refresh tokens.
     * @throws TokenException If an exception occurs during the authentication process.
     */
    public User signIn(UserLoginDTO user) throws TokenException;
}
