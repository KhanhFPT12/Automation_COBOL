
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1dcmService;

import fa.training.repository.bms.Bnk1dcmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1dcmServiceImpl implements Bnk1dcmService {

    @Autowired
    private Bnk1dcmRepository repository;

}
