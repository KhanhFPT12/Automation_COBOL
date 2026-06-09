package fa.training.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import fa.training.dto.request.UserDTO;
import fa.training.dto.response.ResponseObject;
import fa.training.dto.response.UserResponseDTO;
import fa.training.exception.NoResourceFoundException;
import fa.training.exception.WeakPasswordException;
import fa.training.mapper.UserResponseMapper;
import fa.training.model.User;
import fa.training.service.UserService;

/**
 * The UserController class handles user-related operations.
 * 
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-15
 */
@Controller
@RequestMapping("/api/v1/user")
public class UserController {

    private UserService userService;

    private UserResponseMapper userResponseMapper;

    public UserController(UserService userService, UserResponseMapper userResponseMapper) {
        this.userResponseMapper = userResponseMapper;
        this.userService = userService;
    }

    /**
     * Handles the addition of a new user.
     * 
     * @param user The UserDTO object containing user information.
     * @return ResponseEntity with a ResponseObject containing the result of the
     *         user addition operation.
     * @throws WeakPasswordException
     */
    @PostMapping
    public ResponseEntity<ResponseObject> create(@RequestBody UserDTO user) throws WeakPasswordException {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return new ResponseEntity<>(
                    ResponseObject.builder().httpStatus(HttpStatus.CONFLICT)
                            .error("The username is already in use in the system").build(),
                    HttpStatus.CONFLICT);
        }
        try {
            return new ResponseEntity<>(ResponseObject.builder().data(userService.insert(user)).status("success")
                    .httpStatus(HttpStatus.CREATED).build(), HttpStatus.CREATED);
        } catch (WeakPasswordException e) {
            throw new WeakPasswordException();
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseObject(), HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * Handles the update of user information.
     * 
     * @param user The UserDTO object containing updated user information.
     * @return ResponseEntity with a ResponseObject containing the result of the
     *         user update operation.
     * @throws NoResourceFoundException If the specified user is not found.
     */
    @PutMapping
    public ResponseEntity<ResponseObject> update(@RequestBody UserDTO user) throws NoResourceFoundException {
        return new ResponseEntity<>(
                ResponseObject.builder().data(userService.updateUser(user.getUsername(), user)).status("success")
                        .httpStatus(HttpStatus.OK).build(),
                HttpStatus.OK);
    }

    /**
     * Handles the update of user password.
     * 
     * @param user The UserDTO object containing updated password information.
     * @return ResponseEntity with a ResponseObject containing the result of the
     *         password update operation.
     * @throws NoResourceFoundException If the specified user is not found.
     * @throws WeakPasswordException    If the new password is considered weak.
     */
    @PutMapping("password")
    public ResponseEntity<ResponseObject> updateUserPassword(@RequestBody UserDTO user)
            throws NoResourceFoundException, WeakPasswordException {
        return new ResponseEntity<>(
                ResponseObject.builder().data(userService.updateUserPassword(user.getUsername(), user))
                        .status("success")
                        .httpStatus(HttpStatus.OK).build(),
                HttpStatus.OK);

    }

    /**
     * Handles the deletion of a user by username.
     * 
     * @param username The username of the user to be deleted.
     * @return ResponseEntity with a ResponseObject containing the result of the
     *         user deletion operation.
     * @throws NoResourceFoundException If the specified user is not found.
     */
    @DeleteMapping("/{username}")
    public ResponseEntity<ResponseObject> deleteUser(@PathVariable("username") String username)
            throws NoResourceFoundException {
        userService.deleteUser(username);
        return new ResponseEntity<>(ResponseObject.builder().httpStatus(HttpStatus.OK).status("success").build(),
                HttpStatus.ACCEPTED);
    }

    /**
     * Retrieves a page of users with specified size and page number.
     *
     * @param size The number of users to include in each page.
     * @param page The page number to retrieve.
     * @return ResponseEntity containing a list of UserResponseDTOs and HTTP status
     *         OK.
     */
    @GetMapping("/{size}/{page}")
    public ResponseEntity<?> findAllUserPage(@PathVariable("size") Integer size, @PathVariable("page") Integer page) {
        List<UserResponseDTO> pagedUser = userService.findAllWithPaging(size, page);
        return new ResponseEntity<>(ResponseObject.builder().data(pagedUser).httpStatus(HttpStatus.OK).build(),
                HttpStatus.OK);
    }

    /**
     * Retrieves a user by username.
     *
     * @param username The username of the user to retrieve.
     * @return ResponseEntity containing the UserResponseDTO and HTTP status OK.
     * @throws NoResourceFoundException If the user with the specified username is
     *                                  not found.
     */
    @GetMapping("/{username}")
    public ResponseEntity<?> findUserByUsername(@PathVariable("username") String username)
            throws NoResourceFoundException {
        User user = userService.findByUsername(username).orElse(null);
        UserResponseDTO userResponseDTO;
        if (user == null) {
            throw new NoResourceFoundException(username, "USER");
        } else {
            userResponseDTO = userResponseMapper.toDTO(user);
        }
        return new ResponseEntity<>(ResponseObject.builder().data(userResponseDTO).httpStatus(HttpStatus.OK).build(),
                HttpStatus.OK);
    }

    /**
     * Retrieves all users.
     *
     * @return ResponseEntity containing a list of UserResponseDTOs and HTTP status
     *         OK.
     */
    @GetMapping
    public ResponseEntity<?> findAllUser() {
        List<UserResponseDTO> users = userService.findAll();
        return new ResponseEntity<>(ResponseObject.builder().data(users).httpStatus(HttpStatus.OK).build(),
                HttpStatus.OK);
    }
}
