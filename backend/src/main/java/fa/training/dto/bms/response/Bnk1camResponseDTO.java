

package fa.training.dto.bms.response;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1camResponseDTO {
	private String bnk1cam;
	private String bnk1ca;
	private String company;
	private String accno;
	private String srtcd;
	private String opendd;
	private String openmm;
	private String openyy;
	private String lstmdd;
	private String lstmmm;
	private String lstmyy;
	private String nstmtdd;
	private String nstmtmm;
	private String nstmtyy;
	private String avail;
	private String actbal;
	private String message;
	private String dummy;
	private Integer screenIdField;

}
    