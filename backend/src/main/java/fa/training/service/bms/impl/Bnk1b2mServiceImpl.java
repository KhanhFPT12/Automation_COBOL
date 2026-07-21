
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1b2mService;

import fa.training.repository.bms.Bnk1b2mRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import fa.training.model.bms.Bnk1b2m;

@Service
public class Bnk1b2mServiceImpl implements Bnk1b2mService {

    @Autowired
    private Bnk1b2mRepository repository;

    @Override
    public List<Bnk1b2m> findAll() {
        return repository.findAll();
    }

    @Override
    public Bnk1b2m save(Bnk1b2m entity) {
        return repository.save(entity);
    }

}
