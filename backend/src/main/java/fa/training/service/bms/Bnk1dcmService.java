
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1dcm;

public interface Bnk1dcmService {

	List<Bnk1dcm> findAll();

	Bnk1dcm save(Bnk1dcm entity);

}
