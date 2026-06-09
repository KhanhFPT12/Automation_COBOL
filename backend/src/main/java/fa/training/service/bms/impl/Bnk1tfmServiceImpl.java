
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1tfmService;

import fa.training.repository.bms.Bnk1tfmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1tfmServiceImpl implements Bnk1tfmService {

    @Autowired
    private Bnk1tfmRepository repository;

}
