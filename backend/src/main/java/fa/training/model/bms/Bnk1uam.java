

package fa.training.model.bms;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Builder;

    

@Entity
@Data
@Builder
public class Bnk1uam {
	private Integer accno;
	private String actype;
	private String intrt;
	private String overdr;
	@Id
	private Integer screenIdField;

}
    