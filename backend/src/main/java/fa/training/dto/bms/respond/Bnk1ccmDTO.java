

package fa.training.dto.bms.respond;

import lombok.Builder;
import lombok.Data;

    

@Data
@Builder
public class Bnk1ccmDTO {
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
    