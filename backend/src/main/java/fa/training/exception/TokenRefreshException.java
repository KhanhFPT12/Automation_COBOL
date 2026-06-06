package fa.training.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

/**
 * TokenRefreshException class for errors related to token refresh.
 * 
 * 
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-14
 */
@ResponseStatus(code = HttpStatus.FORBIDDEN)
@Getter
public class TokenRefreshException extends RuntimeException {
    private String message;

    public TokenRefreshException() {
        message = "TokenRefreshException";
    }

    public TokenRefreshException(String token, String mesage) {
        this.message = "TokenRefreshException: " + message + "; token:" + token;
    }
}
