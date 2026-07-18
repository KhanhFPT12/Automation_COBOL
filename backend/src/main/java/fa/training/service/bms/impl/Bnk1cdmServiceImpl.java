
package fa.training.service.bms.impl;

import java.util.List;

import fa.training.model.bms.Bnk1cdm;
import fa.training.service.bms.Bnk1cdmService;

import fa.training.repository.bms.Bnk1cdmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1cdmServiceImpl implements Bnk1cdmService {

    @Autowired
    private Bnk1cdmRepository repository;

    @Override
    public List<Bnk1cdm> findAll() {
        return repository.findAll();
    }

    @Override
    public Bnk1cdm save(Bnk1cdm entity) {
        return repository.save(entity);
    }

}
