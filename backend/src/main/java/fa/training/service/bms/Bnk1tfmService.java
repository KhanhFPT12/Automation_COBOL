
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1tfm;

public interface Bnk1tfmService {

	List<Bnk1tfm> findAll();

	Bnk1tfm save(Bnk1tfm entity);

}
