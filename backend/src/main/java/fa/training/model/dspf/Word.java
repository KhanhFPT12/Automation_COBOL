

package fa.training.model.dspf;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Builder;

    

@Entity
@Data
@Builder
public class Word {
	private String option;
	private String id_cli;
	@Id
	private Integer screenIdField;

}
    