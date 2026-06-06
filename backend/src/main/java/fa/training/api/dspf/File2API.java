

package fa.training.api.dspf;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.dspf.File2DTO;
import fa.training.dto.dspf.response.File2ResponseDTO;
import fa.training.service.dspf.File2Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/File2")
public class File2API  {

    @Autowired
    private File2Service service;

    @GetMapping
    public List<File2DTO> getAll() {
        return new ArrayList<File2DTO>();
    }

    @PostMapping
    public File2ResponseDTO postMethodName(@RequestBody File2DTO entity) {
        return File2ResponseDTO.builder().wdate("A").wname("A").dtokc1("A").dtokc2("A").dtodc2("A").dkbn("A").dtokc3("A").dtokm1("A").dtokm2("A").dtodm2("A").dtokm3("A").wkanmk("A").build();
    }

}
