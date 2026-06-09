

package fa.training.model.bms;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Builder;

    

@Entity
@Data
@Builder
public class Bnk1b2m {
	private Integer faccno;
	private String amt;
	private Integer taccno;
	@Id
	private Integer screenIdField;

}
    