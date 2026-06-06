
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1damService;

import fa.training.repository.bms.Bnk1damRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1damServiceImpl implements Bnk1damService {

    @Autowired
    private Bnk1damRepository repository;

}
