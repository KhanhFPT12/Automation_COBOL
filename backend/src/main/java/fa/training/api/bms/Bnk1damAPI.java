

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1damDTO;
import fa.training.dto.bms.response.Bnk1damResponseDTO;
import fa.training.service.bms.Bnk1damService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1dam")
public class Bnk1damAPI  {

    @Autowired
    private Bnk1damService service;

    @GetMapping
    public List<Bnk1damDTO> getAll() {
        return new ArrayList<Bnk1damDTO>();
    }

    @PostMapping
    public Bnk1damResponseDTO postMethodName(@RequestBody Bnk1damDTO entity) {
        return Bnk1damResponseDTO.builder().bnk1dam("A").bnk1da("A").company("A").custno("A").sortc("A").accno2("A").actype("A").intrt("A").opendd("A").openmm("A").openyy("A").overdr("A").lstmtdd("A").lstmtmm("A").lstmtyy("A").nstmtdd("A").nstmtmm("A").nstmtyy("A").avbal("A").actbal("A").message("A").dummy("A").build();
    }

}
