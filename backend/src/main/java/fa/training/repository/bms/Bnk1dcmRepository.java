

package fa.training.repository.bms;

import fa.training.model.bms.Bnk1dcm;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

    
@Repository
public interface Bnk1dcmRepository extends JpaRepository<Bnk1dcm, Integer> {

}
    