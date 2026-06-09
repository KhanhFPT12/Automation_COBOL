package fa.training.dto.response;

import fa.training.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private String firstName;
    private String lastName;
    private String username;
    private Role role;
}
