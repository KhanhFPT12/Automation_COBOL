
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1dam;

public interface Bnk1damService {

    List<Bnk1dam> findAll();

    Bnk1dam save(Bnk1dam entity);

}
