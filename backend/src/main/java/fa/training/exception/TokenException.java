package fa.training.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

/**
 * TokenException class for token-related errors.
 * It is annotated with @ResponseStatus to indicate the HTTP status code when this exception is thrown.
 * 
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-14
 */
@Getter
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class TokenException extends Exception {
    private String message;

    public TokenException() {
        message = "TokenException";
    }

    public TokenException(String message) {
        this.message = message;
    }
}
