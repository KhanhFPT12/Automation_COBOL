

package fa.training.dto.bms.response;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1cdmResponseDTO {
	private String bnk1cdm;
	private String bnk1cd;
	private String company;
	private Integer sortc;
	private String avbal;
	private String actbal;
	private String message;
	private String dummy;
	private Integer screenIdField;

}
    