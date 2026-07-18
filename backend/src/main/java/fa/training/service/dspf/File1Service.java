
package fa.training.service.dspf;

import java.util.List;

import fa.training.model.dspf.File1;

public interface File1Service {

    List<File1> findAll();

    File1 save(File1 entity);

}
