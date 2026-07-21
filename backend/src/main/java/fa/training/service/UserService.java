package fa.training.service;

import java.util.List;
import java.util.Optional;

import fa.training.dto.request.UserDTO;
import fa.training.dto.response.UserResponseDTO;
import fa.training.exception.NoResourceFoundException;
import fa.training.exception.WeakPasswordException;
import fa.training.model.User;

public interface UserService {

    /**
     * Inserts a new user with a strong password, encoding the password and setting
     * default values.
     * Throws WeakPasswordException if the password is not strong.
     * 
     * @param user The User entity to be inserted.
     * @return The inserted User entity.
     * @throws WeakPasswordException If the password is not strong.
     */
    public UserDTO insert(UserDTO userRegister) throws WeakPasswordException;

    /**
     * Registers a new admin user with a strong password, encoding the password and
     * setting default values.
     * Throws WeakPasswordException if the password is not strong.
     * 
     * @param user The User entity to be registered as an admin.
     * @return The registered User entity.
     * @throws WeakPasswordException If the password is not strong.
     */
    public UserDTO register(UserDTO userRegister) throws WeakPasswordException;

    /**
     * Finds a user by their username.
     * 
     * @param username The username of the user to find.
     * @return An Optional containing the User if found, otherwise empty.
     */
    public Optional<User> findByUsername(String username);

    public UserDTO updateUser(String username, UserDTO updatedUser) throws NoResourceFoundException;

    public UserDTO updateUserPassword(String username, UserDTO updatedUser)
            throws NoResourceFoundException, WeakPasswordException;

    public void deleteUser(String username) throws NoResourceFoundException;

    public List<UserResponseDTO> findAllWithPaging(Integer size, Integer page);
    public List<UserResponseDTO> findAll();

}