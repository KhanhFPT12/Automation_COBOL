package fa.training.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * WeakPasswordException class for indicating a weak password.
 *
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-14
 */
@AllArgsConstructor
@Builder
@Setter
@Getter
@ResponseStatus(code = HttpStatus.NOT_ACCEPTABLE)
public class WeakPasswordException extends Exception {
    private String message;

    public WeakPasswordException() {
        message = "WeakPasswordException";
    }
}
