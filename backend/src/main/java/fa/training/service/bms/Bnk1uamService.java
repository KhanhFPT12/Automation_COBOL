
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1uam;

public interface Bnk1uamService {

    List<Bnk1uam> findAll();

    Bnk1uam save(Bnk1uam entity);

}
