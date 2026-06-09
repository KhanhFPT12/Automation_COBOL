package fa.training.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.request.UserDTO;
import fa.training.dto.request.UserLoginDTO;
import fa.training.dto.response.ResponseObject;
import fa.training.exception.TokenException;
import fa.training.exception.TokenRefreshException;
import fa.training.exception.WeakPasswordException;
import fa.training.model.RefreshToken;
import fa.training.model.User;
import fa.training.service.AuthenticationService;
import fa.training.service.UserService;
import fa.training.service.token.RefreshTokenSerice;

/**
 * The AuthenticationController class handles authentication-related operations.
 * 
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-15
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserService userService;

    /**
     * Handles admin registration.
     * 
     * @param user The UserDTO object containing user information.
     * @return ResponseEntity with a ResponseObject containing the result of the
     *         signup operation.
     * @throws WeakPasswordException
     */
    @PostMapping("signup")
    public ResponseEntity<ResponseObject> signUp(@RequestBody UserDTO user) throws WeakPasswordException {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return new ResponseEntity<>(
                    ResponseObject.builder().httpStatus(HttpStatus.CONFLICT)
                            .error("The username is already in use in the system").build(),
                    HttpStatus.CONFLICT);
        }
        try {
            return new ResponseEntity<>(ResponseObject.builder().data(userService.register(user)).status("success")
                    .httpStatus(HttpStatus.CREATED).build(), HttpStatus.CREATED);
        } catch (WeakPasswordException e) {
            throw new WeakPasswordException();
            // return new ResponseEntity<>(new ResponseObject(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseObject(), HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * Handles user sign-in and generates authentication tokens.
     * 
     * @param user The UserLoginDTO object containing user login information.
     * @return ResponseEntity with a ResponseObject containing the authentication
     *         tokens.
     * @throws TokenException If there is an issue generating tokens.
     */
    @PostMapping("signin")
    public ResponseEntity<?> signIn(@RequestBody UserLoginDTO user) throws TokenException {
        Map<String, String> response = new HashMap<>();
        User signedUser = authenticationService.signIn(user);
        response.put("token", signedUser.getToken());
        response.put("rf_token", signedUser.getRfToken().getRfToken());
        return new ResponseEntity<>(ResponseObject.builder().data(response).build(), HttpStatus.OK);

    }

    @Autowired
    RefreshTokenSerice refreshTokenSerice;

    /**
     * Handles token refresh operation.
     * 
     * @param entity The RefreshToken object containing the refresh token.
     * @return ResponseEntity with a ResponseObject containing the new
     *         authentication token.
     * @throws TokenRefreshException If there is an issue refreshing the token.
     */
    @PostMapping("refresh")
    public ResponseEntity<?> getMethodName(@RequestBody RefreshToken entity) throws TokenRefreshException {
        Map<String, String> response = new HashMap<>();
        response.put("token", refreshTokenSerice.refreshToken(entity.getRfToken()));
        return new ResponseEntity<>(ResponseObject.builder().data(response).build(), HttpStatus.OK);
    }

   

}
