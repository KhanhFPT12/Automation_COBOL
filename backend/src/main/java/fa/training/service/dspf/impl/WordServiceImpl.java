
package fa.training.service.dspf.impl;

import fa.training.service.dspf.WordService;

import fa.training.repository.dspf.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class WordServiceImpl implements WordService {

    @Autowired
    private WordRepository repository;

}
