

package fa.training.api.dspf;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.dspf.File1DTO;
import fa.training.dto.dspf.response.File1ResponseDTO;
import fa.training.service.dspf.File1Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/File1")
public class File1API  {

    @Autowired
    private File1Service service;

    @GetMapping
    public List<File1DTO> getAll() {
        return new ArrayList<File1DTO>();
    }

    @PostMapping
    public File1ResponseDTO postMethodName(@RequestBody File1DTO entity) {
        return File1ResponseDTO.builder().f1libl("A").f1synm("A").f1text("A").f1symk("A").f1yot1("A").f1yot2("A").f1yot3("A").f1yot4("A").f1bik1("A").f1bik2("A").f1bik3("A").f1bik4("A").f1syyy("A").f1symm("A").f1sydd("A").f1tape("A").f2tape("A").f3tape("A").f4tape("A").f1tpno("A").f1msg("A").build();
    }

}
