

package fa.training.dto.bms;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1camDTO {
	private Integer custno;
	private String acctyp;
	private String intrt;
	private Integer overdr;
	private Integer screenIdField;

}
    