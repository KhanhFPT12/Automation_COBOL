

package fa.training.dto.bms.response;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1b2mResponseDTO {
	private String bnk1tfm;
	private String bnk1b2;
	private String company;
	private String fscde1;
	private String fscde2;
	private String fscde3;
	private String actsign;
	private Integer actpnd;
	private Integer actpnc;
	private String avasign;
	private Integer avapnd;
	private Integer avapnc;
	private String tscde1;
	private String tscde2;
	private Integer tscde3;
	private String message;
	private String dummy;
	private Integer screenIdField;

}
    