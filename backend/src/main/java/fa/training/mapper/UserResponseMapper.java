package fa.training.mapper;

import org.springframework.stereotype.Component;

import fa.training.dto.response.UserResponseDTO;
import fa.training.model.User;

@Component
public class UserResponseMapper {
    public User toEntity(UserResponseDTO userResponseDTO) {

        return User.builder()
                .firstName(userResponseDTO.getFirstName())
                .username(userResponseDTO.getUsername())
                .lastName(userResponseDTO.getLastName())
                .role(userResponseDTO.getRole()).build();
    }

    public UserResponseDTO toDTO(User user) {
        return UserResponseDTO.builder().firstName(user.getFirstName()).username(user.getUsername())
                .lastName(user.getLastName()).role(user.getRole()).build();
    }
}
