

package fa.training.dto.bms.response;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class Bnk1tfmResponseDTO {
	private String bnk1tfm;
	private String bnk1tf;
	private String company;
	private Integer faccno2;
	private String taccno2;
	private Integer fsortc;
	private Integer tsortc;
	private String factbal;
	private String tactbal;
	private String favbal;
	private String tavbal;
	private String message;
	private String dummy;
	private Integer screenIdField;

}
    