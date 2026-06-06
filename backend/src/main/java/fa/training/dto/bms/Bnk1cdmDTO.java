

package fa.training.dto.bms;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1cdmDTO {
	private Integer accno;
	private String sign;
	private String amt;
	private Integer screenIdField;

}
    