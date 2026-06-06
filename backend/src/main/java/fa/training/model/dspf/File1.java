

package fa.training.model.dspf;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Builder;

    

@Entity
@Data
@Builder
public class File1 {
	private String f1libl;
	private String f1text;
	private String f1symk;
	private String f1yot1;
	private String f1yot2;
	private String f1yot3;
	private String f1yot4;
	private String f1bik1;
	private String f1bik2;
	private String f1bik3;
	private String f1bik4;
	private String f1syyy;
	private String f1symm;
	private String f1sydd;
	private String f1tape;
	private String f2tape;
	private String f3tape;
	private String f4tape;
	private String f1tpno;
	@Id
	private Integer screenIdField;

}
    