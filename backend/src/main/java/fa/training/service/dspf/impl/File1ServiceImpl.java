
package fa.training.service.dspf.impl;

import fa.training.service.dspf.File1Service;

import fa.training.repository.dspf.File1Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class File1ServiceImpl implements File1Service {

    @Autowired
    private File1Repository repository;

}
