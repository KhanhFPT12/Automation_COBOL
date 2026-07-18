
package fa.training.service.bms;

import java.util.List;

import fa.training.model.bms.Bnk1cam;

public interface Bnk1camService {

    List<Bnk1cam> findAll();

    Bnk1cam save(Bnk1cam entity);

}
