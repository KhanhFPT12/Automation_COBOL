
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1uamService;

import fa.training.repository.bms.Bnk1uamRepository;
import fa.training.model.bms.Bnk1uam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class Bnk1uamServiceImpl implements Bnk1uamService {

    @Autowired
    private Bnk1uamRepository repository;

    @Override
    public List<Bnk1uam> findAll() {
        return repository.findAll();
    }

    @Override
    public Bnk1uam save(Bnk1uam entity) {
        return repository.save(entity);
    }

}
