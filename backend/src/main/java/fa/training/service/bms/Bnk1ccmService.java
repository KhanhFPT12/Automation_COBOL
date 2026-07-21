
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1ccm;

public interface Bnk1ccmService {

    List<Bnk1ccm> findAll();

    Bnk1ccm save(Bnk1ccm entity);

}
