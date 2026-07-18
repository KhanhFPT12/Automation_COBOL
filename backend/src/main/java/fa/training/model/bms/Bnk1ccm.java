

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
public class Bnk1ccm {
	private String custtit;
	private String christn;
	private String custins;
	private String custsn;
	private String custad1;
	private String custad2;
	private String custad3;
	private Integer dobdd;
	private Integer dobmm;
	private Integer dobyy;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer screenIdField;

}
    