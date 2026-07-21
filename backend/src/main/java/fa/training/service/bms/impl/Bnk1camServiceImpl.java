
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1camService;

import fa.training.repository.bms.Bnk1camRepository;
import fa.training.model.bms.Bnk1cam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class Bnk1camServiceImpl implements Bnk1camService {

    @Autowired
    private Bnk1camRepository repository;

    @Override
    public List<Bnk1cam> findAll() {
        return repository.findAll();
    }

    @Override
    public Bnk1cam save(Bnk1cam entity) {
        return repository.save(entity);
    }

}
