

package fa.training.model.dspf;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import lombok.Builder;

    

@Entity
@Data
@Builder
public class File2 {
	private String dtokc1;
	private String dtokc2;
	private String dtodc2;
	private String dkbn;
	private String dtokc3;
	private String wkanmk;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer screenIdField;

}
    