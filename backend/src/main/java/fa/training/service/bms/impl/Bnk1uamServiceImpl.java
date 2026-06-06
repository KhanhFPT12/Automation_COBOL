
package fa.training.service.bms.impl;

import fa.training.service.bms.Bnk1uamService;

import fa.training.repository.bms.Bnk1uamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class Bnk1uamServiceImpl implements Bnk1uamService {

    @Autowired
    private Bnk1uamRepository repository;

}
