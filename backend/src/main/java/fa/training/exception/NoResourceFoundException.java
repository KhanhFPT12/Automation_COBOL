package fa.training.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

@Getter
@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class NoResourceFoundException extends Exception {
    private String message;

    public NoResourceFoundException() {
        this.message = "NORESOURCEFOUNDEXCEPTION";
    }

    public NoResourceFoundException(String resource, String type) {
        this.message = "NoResourceFound From " + type + "(" + resource + ")";
    }
}
