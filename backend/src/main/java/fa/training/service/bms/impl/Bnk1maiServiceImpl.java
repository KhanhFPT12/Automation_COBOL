
package fa.training.service.bms.impl;

import java.util.List;

import fa.training.model.bms.Bnk1mai;
import fa.training.service.bms.Bnk1maiService;

import fa.training.repository.bms.Bnk1maiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1maiServiceImpl implements Bnk1maiService {

    @Autowired
    private Bnk1maiRepository repository;

    @Override
    public List<Bnk1mai> findAll() {
        return repository.findAll();
    }

    @Override
    public Bnk1mai save(Bnk1mai entity) {
        return repository.save(entity);
    }

}
