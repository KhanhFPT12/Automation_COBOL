
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1accService;

import fa.training.repository.bms.Bnk1accRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1accServiceImpl implements Bnk1accService {

    @Autowired
    private Bnk1accRepository repository;

}
