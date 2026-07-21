

package fa.training.repository.dspf;

import fa.training.model.dspf.Word;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

    
@Repository
public interface WordRepository extends JpaRepository<Word, Integer> {

}
    