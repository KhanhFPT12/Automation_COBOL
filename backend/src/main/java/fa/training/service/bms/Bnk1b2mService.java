
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1b2m;

public interface Bnk1b2mService {

    List<Bnk1b2m> findAll();

    Bnk1b2m save(Bnk1b2m entity);

}
