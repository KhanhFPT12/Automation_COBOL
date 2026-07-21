
package fa.training.service.dspf;

import java.util.List;

import fa.training.model.dspf.Word;

public interface WordService {

	List<Word> findAll();

	Word save(Word entity);

}
