

package fa.training.model.bms;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Builder;

    

@Entity
@Data
@Builder
public class Bnk1dcm {
	private String custno;
	@Id
	private Integer screenIdField;

}
    