package fa.training.mapper;

import org.springframework.stereotype.Component;

import fa.training.dto.request.UserLoginDTO;
import fa.training.model.User;

@Component
public class UserLoginMapper {
    public User toEntity(UserLoginDTO userLoginDTO) {

        return User.builder().username(userLoginDTO.getUsername())
                .password(userLoginDTO.getPassword()).build();
    }

    public UserLoginDTO toDTO(User user) {
        return UserLoginDTO.builder().username(user.getUsername())
                .password(user.getPassword()).build();
    }

}
