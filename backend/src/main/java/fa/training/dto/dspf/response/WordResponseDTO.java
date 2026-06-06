

package fa.training.dto.dspf.response;

import lombok.Data;
import lombok.Builder;

    

@Data
@Builder
public class WordResponseDTO {
	private String id_crd;
	private String shop_crd;
	private String name_shp;
	private String id_cli;
	private Integer screenIdField;

}
    