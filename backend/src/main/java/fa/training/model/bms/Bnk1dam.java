

package fa.training.model.bms;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import lombok.Builder;



@Entity
@Data
@Builder
public class Bnk1dam {
	private Integer accno;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer screenIdField;

}
    