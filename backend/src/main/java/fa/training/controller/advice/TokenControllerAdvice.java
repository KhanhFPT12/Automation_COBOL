package fa.training.controller.advice;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import fa.training.dto.response.ResponseObject;
import fa.training.exception.TokenException;
import fa.training.exception.TokenRefreshException;
import io.jsonwebtoken.ExpiredJwtException;

/**
 * Controller advice class for handling exceptions related to tokens.
 * It provides methods to handle specific token-related exceptions and general
 * runtime exceptions.
 * Utilizes ResponseEntity and ResponseStatus annotations for customizing HTTP
 * responses.
 * 
 * @see TokenRefreshException
 * @see TokenException
 * @see ExpiredJwtException
 * @see AccessDeniedException
 * @see RuntimeException
 * @see org.springframework.web.servlet.resource.NoResourceFoundException
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-14
 */
@ControllerAdvice
public class TokenControllerAdvice {
    /**
     * Handles TokenRefreshException and returns a custom response.
     * 
     * @param ex  The TokenRefreshException to handle.
     * @param req The WebRequest.
     * @return ResponseEntity containing a custom error message and status code.
     */
    @ExceptionHandler(value = TokenRefreshException.class)
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public ResponseEntity<ResponseObject> handleTokenRefreshException(TokenRefreshException ex, WebRequest req) {
        return new ResponseEntity<>(ResponseObject.builder().error("Error with refresh token: " + ex.getMessage())
                .status("Token Error").httpStatus(HttpStatus.FORBIDDEN).build(), HttpStatus.FORBIDDEN);
    }

    /**
     * Handles TokenException and returns a custom response.
     * 
     * @param ex  The TokenException to handle.
     * @param req The WebRequest.
     * @return ResponseEntity containing a custom error message and status code.
     */
    @ExceptionHandler(value = TokenException.class)
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public ResponseEntity<ResponseObject> handleTokenException(TokenException ex, WebRequest req) {

        return new ResponseEntity<>(
                ResponseObject.builder().error(ex.getMessage()).status("Token Error").httpStatus(HttpStatus.FORBIDDEN).build(),
                HttpStatus.FORBIDDEN);
    }

    /**
     * Handles ExpiredJwtException and returns a custom response.
     * 
     * @param ex  The ExpiredJwtException to handle.
     * @param req The WebRequest.
     * @return ResponseEntity containing a custom error message and status code.
     */
    @ExceptionHandler(value = ExpiredJwtException.class)
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public ResponseEntity<?> handelExpiredTokenException(ExpiredJwtException ex, WebRequest req) {

        return new ResponseEntity<>(
                ResponseObject.builder().error(ex.getMessage()).status("Token Error").httpStatus(HttpStatus.FORBIDDEN).build(),
                HttpStatus.FORBIDDEN);
    }

    /**
     * Handles AccessDeniedException and returns a custom response.
     * @param ex The AccessDeniedException to handle.
     * @return ResponseEntity containing a custom error message and status.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ResponseObject> handleAccessDeniedException(AccessDeniedException ex) {

        return new ResponseEntity<>(
                ResponseObject.builder().error(ex.getMessage()).status("Access denied").build(),
                HttpStatus.FORBIDDEN);
    }

    /**
     * Handles NoResourceFoundException and returns a custom response.
     * 
     * @param ex The NoResourceFoundException to handle.
     * @return ResponseEntity containing a custom error message, status code, and a
     *         ResponseObject.
     * 
     * @see ResponseObject
     */
    @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ResponseObject> handle404(
            org.springframework.web.servlet.resource.NoResourceFoundException ex) {

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("error", "404 - Not Found");
        responseBody.put("message", "The requested resource was not found on this server.");
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ResponseObject.builder().httpStatus(HttpStatus.NOT_FOUND).error("404 - Not Found")
                        .message("The requested resource was not found on this server.").build());

    }

    
}
