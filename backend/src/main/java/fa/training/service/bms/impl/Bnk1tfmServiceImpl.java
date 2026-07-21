
package fa.training.service.bms.impl;

import java.util.List;

import fa.training.model.bms.Bnk1tfm;
import fa.training.service.bms.Bnk1tfmService;

import fa.training.repository.bms.Bnk1tfmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1tfmServiceImpl implements Bnk1tfmService {

    @Autowired
    private Bnk1tfmRepository repository;

    @Override
    public List<Bnk1tfm> findAll() {
        return repository.findAll();
    }

    @Override
    public Bnk1tfm save(Bnk1tfm entity) {
        return repository.save(entity);
    }

}
