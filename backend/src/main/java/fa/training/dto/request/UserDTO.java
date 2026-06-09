package fa.training.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class UserDTO {

    private String firstName;

    private String lastName;

    @NonNull
    private String username;

    @NonNull
    private String password;

}
