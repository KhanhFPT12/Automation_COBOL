
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1mai;

public interface Bnk1maiService {

	List<Bnk1mai> findAll();

	Bnk1mai save(Bnk1mai entity);

}
