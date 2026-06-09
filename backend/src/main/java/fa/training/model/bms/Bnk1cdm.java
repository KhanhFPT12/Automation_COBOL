

package fa.training.model.bms;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Builder;

    

@Entity
@Data
@Builder
public class Bnk1cdm {
	private Integer accno;
	private String sign;
	private String amt;
	@Id
	private Integer screenIdField;

}
    