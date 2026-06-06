

package fa.training.dto.bms;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1tfmDTO {
	private Integer faccno;
	private Integer taccno;
	private String amt;
	private Integer screenIdField;

}
    