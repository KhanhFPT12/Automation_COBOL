package fa.training.mapper;

import org.springframework.stereotype.Component;

import fa.training.dto.request.UserDTO;
import fa.training.model.User;

@Component
public class UserRegisterMapper {
    public User toEntity(UserDTO userRegisterDTO) {

        return User.builder().firstName(userRegisterDTO.getFirstName()).username(userRegisterDTO.getUsername())
                .password(userRegisterDTO.getPassword()).lastName(userRegisterDTO.getLastName()).build();
    }

    public UserDTO toUserRegisterDTO(User user) {
        return UserDTO.builder().firstName(user.getFirstName()).username(user.getUsername())
                .password(user.getPassword()).lastName(user.getLastName()).build();
    }
}
