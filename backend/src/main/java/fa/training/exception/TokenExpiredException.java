package fa.training.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

/**
 * TokenExpiredException class for indicating that a token has expired.
 * 
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-14
 */
@Getter
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class TokenExpiredException extends Exception {
    private String message;

    public TokenExpiredException() {
        message = "Token has been expired";
    }
}
