

package fa.training.repository.bms;

import fa.training.model.bms.Bnk1cdm;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

    
@Repository
public interface Bnk1cdmRepository extends JpaRepository<Bnk1cdm, Integer> {

}
    