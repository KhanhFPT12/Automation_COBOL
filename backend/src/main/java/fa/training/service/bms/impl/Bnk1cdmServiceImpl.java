
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1cdmService;

import fa.training.repository.bms.Bnk1cdmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1cdmServiceImpl implements Bnk1cdmService {

    @Autowired
    private Bnk1cdmRepository repository;

}
