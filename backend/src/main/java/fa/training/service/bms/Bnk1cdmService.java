
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1cdm;

public interface Bnk1cdmService {

    List<Bnk1cdm> findAll();

    Bnk1cdm save(Bnk1cdm entity);

}
