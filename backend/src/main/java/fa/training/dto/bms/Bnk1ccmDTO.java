

package fa.training.dto.bms;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1ccmDTO {
	private String custtit;
	private String christn;
	private String custins;
	private String custsn;
	private String custad1;
	private String custad2;
	private String custad3;
	private Integer dobdd;
	private Integer dobmm;
	private Integer dobyy;
	private Integer screenIdField;

}
    