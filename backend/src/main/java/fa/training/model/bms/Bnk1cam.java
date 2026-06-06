

package fa.training.model.bms;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Builder;

    

@Entity
@Data
@Builder
public class Bnk1cam {
	private Integer custno;
	private String acctyp;
	private String intrt;
	private Integer overdr;
	@Id
	private Integer screenIdField;

}
    