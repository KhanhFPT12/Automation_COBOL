

package fa.training.dto.bms;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1uamDTO {
	private Integer accno;
	private String actype;
	private String intrt;
	private String overdr;
	private Integer screenIdField;

}
    