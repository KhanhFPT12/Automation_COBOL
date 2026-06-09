

package fa.training.dto.bms.response;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1ccmResponseDTO {
	private String bnk1ccm;
	private String bnk1cc;
	private String company;
	private Integer sortc;
	private Integer custno2;
	private Integer credsc;
	private Integer scrdtdd;
	private Integer scrdtmm;
	private Integer scrdtyy;
	private String message;
	private String dummy;
	private Integer screenIdField;

}
    