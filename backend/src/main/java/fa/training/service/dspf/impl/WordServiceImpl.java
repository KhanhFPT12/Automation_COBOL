
package fa.training.service.dspf.impl;

import java.util.List;

import fa.training.model.dspf.Word;
import fa.training.service.dspf.WordService;

import fa.training.repository.dspf.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class WordServiceImpl implements WordService {

    @Autowired
    private WordRepository repository;

    @Override
    public List<Word> findAll() {
        return repository.findAll();
    }

    @Override
    public Word save(Word entity) {
        return repository.save(entity);
    }

}
