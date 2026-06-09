
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1ccmService;

import fa.training.repository.bms.Bnk1ccmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1ccmServiceImpl implements Bnk1ccmService {

    @Autowired
    private Bnk1ccmRepository repository;

}
