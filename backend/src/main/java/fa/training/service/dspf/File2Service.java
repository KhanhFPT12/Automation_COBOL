
package fa.training.service.dspf;

import java.util.List;

import fa.training.model.dspf.File2;

public interface File2Service {

    List<File2> findAll();

    File2 save(File2 entity);

}
