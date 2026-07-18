
package fa.training.service.dspf.impl;

import fa.training.service.dspf.File1Service;

import fa.training.repository.dspf.File1Repository;
import fa.training.model.dspf.File1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class File1ServiceImpl implements File1Service {

    @Autowired
    private File1Repository repository;

    @Override
    public List<File1> findAll() {
        return repository.findAll();
    }

    @Override
    public File1 save(File1 entity) {
        return repository.save(entity);
    }

}
