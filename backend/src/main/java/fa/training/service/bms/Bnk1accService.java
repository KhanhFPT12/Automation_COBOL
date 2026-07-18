
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1acc;

public interface Bnk1accService {

	List<Bnk1acc> findAll();

	Bnk1acc save(Bnk1acc entity);

}
