

package fa.training.dto.bms.response;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1uamResponseDTO {
	private String bnk1uam;
	private String bnk1ua;
	private String company;
	private String custno;
	private String sortc;
	private String accno2;
	private String opendd;
	private String openmm;
	private String openyy;
	private String lstmtdd;
	private String lstmtmm;
	private String lstmtyy;
	private String nstmtdd;
	private String nstmtmm;
	private String nstmtyy;
	private String avbal;
	private String actbal;
	private String message;
	private String dummy;
	private Integer screenIdField;

}
    