

package fa.training.dto.bms.response;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1accResponseDTO {
	private String bnk1acc;
	private String company;
	private String account;
	private String message;
	private String dummy;
	private Integer screenIdField;

}
    