

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1camDTO;
import fa.training.dto.bms.response.Bnk1camResponseDTO;
import fa.training.service.bms.Bnk1camService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1cam")
public class Bnk1camAPI  {

    @Autowired
    private Bnk1camService service;

    @GetMapping
    public List<Bnk1camDTO> getAll() {
        return new ArrayList<Bnk1camDTO>();
    }

    @PostMapping
    public Bnk1camResponseDTO postMethodName(@RequestBody Bnk1camDTO entity) {
        return Bnk1camResponseDTO.builder().bnk1cam("A").bnk1ca("A").company("A").accno("A").srtcd("A").opendd("A").openmm("A").openyy("A").lstmdd("A").lstmmm("A").lstmyy("A").nstmtdd("A").nstmtmm("A").nstmtyy("A").avail("A").actbal("A").message("A").dummy("A").build();
    }

}
