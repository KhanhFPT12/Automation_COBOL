

package fa.training.model.bms;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Builder;

    

@Entity
@Data
@Builder
public class Bnk1mai {
	private Integer action;
	@Id
	private Integer screenIdField;

}
    