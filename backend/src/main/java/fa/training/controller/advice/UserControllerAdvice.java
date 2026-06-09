package fa.training.controller.advice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import fa.training.dto.response.ResponseObject;
import fa.training.exception.NoResourceFoundException;
import fa.training.exception.WeakPasswordException;

@ControllerAdvice
public class UserControllerAdvice {
    /**
     * Handles NoResourceFoundException and returns a custom response.
     * 
     * @param ex The NoResourceFoundException to handle.
     * @return ResponseEntity containing a custom error message, status code, and a
     *         ResponseObject.
     * 
     * @see ResponseObject
     */
    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ResponseObject> handleUserNotFound(NoResourceFoundException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseObject.builder().httpStatus(HttpStatus.BAD_REQUEST).error(ex.getMessage())
                        .message("The requested resource was not found.").build());

    }

    /**
     * Handles WeakPasswordException and returns a custom response.
     * 
     * @param ex The WeakPasswordException to handle.
     * @return ResponseEntity containing a custom error message, status code, and a
     *         ResponseObject.
     * 
     * @see ResponseObject
     */
    @ExceptionHandler(WeakPasswordException.class)
    public ResponseEntity<ResponseObject> handleWeakPasswordException(WeakPasswordException ex) {

        return new ResponseEntity<>(
                ResponseObject.builder().error("password: " + ex.getMessage()).status("Not created").build(),
                HttpStatus.NOT_ACCEPTABLE);
    }
}
