
package fa.training.service.bms.impl;

import java.util.List;

import fa.training.model.bms.Bnk1ccm;
import fa.training.service.bms.Bnk1ccmService;

import fa.training.repository.bms.Bnk1ccmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1ccmServiceImpl implements Bnk1ccmService {

    @Autowired
    private Bnk1ccmRepository repository;

    @Override
    public List<Bnk1ccm> findAll() {
        return repository.findAll();
    }

    @Override
    public Bnk1ccm save(Bnk1ccm entity) {
        return repository.save(entity);
    }

}
