package fa.training.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import fa.training.dto.request.UserDTO;
import fa.training.dto.response.UserResponseDTO;
import fa.training.exception.NoResourceFoundException;
import fa.training.exception.WeakPasswordException;
import fa.training.mapper.UserLoginMapper;
import fa.training.mapper.UserRegisterMapper;
import fa.training.mapper.UserResponseMapper;
import fa.training.model.RefreshToken;
import fa.training.model.Role;
import fa.training.model.User;
import fa.training.repository.RefreshTokenRepository;
import fa.training.repository.UserRepository;
import fa.training.service.UserService;
import fa.training.util.PasswordCheck;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    RefreshTokenRepository refreshTokenRepository;
    @Autowired
    UserRegisterMapper userRegisterMapper;
    @Autowired
    UserLoginMapper userLoginMapper;

    @Autowired
    UserResponseMapper userResponseMapper;

    public UserDTO insert(UserDTO userRegister) throws WeakPasswordException {

        User user = userRegisterMapper.toEntity(userRegister);
        if (!PasswordCheck.isStrongPassword(user.getPassword()))
            throw new WeakPasswordException();

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(new Date(System.currentTimeMillis()));
        user.setBlock(false);
        return userRegisterMapper.toUserRegisterDTO(userRepository.save(user));

    }

    public UserDTO register(UserDTO userRegister) throws WeakPasswordException {
        User user = userRegisterMapper.toEntity(userRegister);
        if (!PasswordCheck.isStrongPassword(user.getPassword()))
            throw new WeakPasswordException();

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.ADMIN);
        user.setCreatedAt(new Date(System.currentTimeMillis()));
        user.setBlock(false);

        return userRegisterMapper.toUserRegisterDTO(userRepository.save(user));

    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public UserDTO updateUser(String username, UserDTO updatedUser) throws NoResourceFoundException {
        Optional<User> existingUserOptional = userRepository.findByUsername(username);

        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();

            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setUpdatedAt(new Date());

            return userRegisterMapper.toUserRegisterDTO(userRepository.save(existingUser));
        } else {
            throw new NoResourceFoundException(username, "USER");
        }
    }

    public UserDTO updateUserPassword(String username, UserDTO updatedUser)
            throws NoResourceFoundException, WeakPasswordException {
        Optional<User> existingUserOptional = userRepository.findByUsername(username);
        if (!PasswordCheck.isStrongPassword(updatedUser.getPassword()))
            throw new WeakPasswordException();
        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();

            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            existingUser.setUpdatedAt(new Date());

            return userRegisterMapper.toUserRegisterDTO(userRepository.save(existingUser));
        } else {
            throw new NoResourceFoundException(username, "USER");
        }
    }

    public void deleteUser(String username) throws NoResourceFoundException {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User userToDelete = userOptional.get();

            List<RefreshToken> rfToken = refreshTokenRepository.findByUser(userToDelete);
            if (rfToken.size() > 0) {
                System.out.println(rfToken.get(0).getRfToken());
                refreshTokenRepository.delete(rfToken.get(0));
            }

            userRepository.delete(userToDelete);
        } else {
            throw new NoResourceFoundException(username, "USER");
        }
    }

    @Override
    public List<UserResponseDTO> findAllWithPaging(Integer size, Integer page) {
        if (size == null || page == null) {
            size = 5;
            page = 5;
        }
        Pageable pageable = PageRequest.of(page, size);
        List<UserResponseDTO> finUser = userRepository.findAll(pageable).getContent().stream()
                .map(x -> userResponseMapper.toDTO(x)).collect(Collectors.toList());
        return finUser;
    }

    @Override
    public List<UserResponseDTO> findAll() {
        List<UserResponseDTO> finUser = userRepository.findAll().stream().map(x -> userResponseMapper.toDTO(x))
                .collect(Collectors.toList());
        return finUser;
    }
}