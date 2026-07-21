

package fa.training.dto.bms.response;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1maiResponseDTO {
	private String bnk1mai;
	private String bnk1me;
	private String company;
	private String message;
	private String dummy;
	private Integer screenIdField;

}
    