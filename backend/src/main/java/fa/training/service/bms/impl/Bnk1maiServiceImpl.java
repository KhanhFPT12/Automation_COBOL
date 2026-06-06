
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1maiService;

import fa.training.repository.bms.Bnk1maiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1maiServiceImpl implements Bnk1maiService {

    @Autowired
    private Bnk1maiRepository repository;

}
