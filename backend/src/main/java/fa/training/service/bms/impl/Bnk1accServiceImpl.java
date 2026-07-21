
package fa.training.service.bms.impl;

import java.util.List;

import fa.training.model.bms.Bnk1acc;
import fa.training.service.bms.Bnk1accService;

import fa.training.repository.bms.Bnk1accRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1accServiceImpl implements Bnk1accService {

    @Autowired
    private Bnk1accRepository repository;

    @Override
    public List<Bnk1acc> findAll() {
        return repository.findAll();
    }

    @Override
    public Bnk1acc save(Bnk1acc entity) {
        return repository.save(entity);
    }

}
