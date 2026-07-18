
package fa.training.service.dspf.impl;

import java.util.List;

import fa.training.model.dspf.File2;
import fa.training.service.dspf.File2Service;

import fa.training.repository.dspf.File2Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class File2ServiceImpl implements File2Service {

    @Autowired
    private File2Repository repository;

    @Override
    public List<File2> findAll() {
        return repository.findAll();
    }

    @Override
    public File2 save(File2 entity) {
        return repository.save(entity);
    }

}
