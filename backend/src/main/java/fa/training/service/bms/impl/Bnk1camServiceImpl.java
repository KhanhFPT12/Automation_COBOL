
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1camService;

import fa.training.repository.bms.Bnk1camRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1camServiceImpl implements Bnk1camService {

    @Autowired
    private Bnk1camRepository repository;

}
