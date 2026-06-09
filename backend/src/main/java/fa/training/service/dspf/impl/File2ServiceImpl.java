
package fa.training.service.dspf.impl;

import fa.training.service.dspf.File2Service;

import fa.training.repository.dspf.File2Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class File2ServiceImpl implements File2Service {

    @Autowired
    private File2Repository repository;

}
