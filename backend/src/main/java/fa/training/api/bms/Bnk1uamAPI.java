

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1uamDTO;
import fa.training.dto.bms.response.Bnk1uamResponseDTO;
import fa.training.service.bms.Bnk1uamService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1uam")
public class Bnk1uamAPI  {

    @Autowired
    private Bnk1uamService service;

    @GetMapping
    public List<Bnk1uamDTO> getAll() {
        return new ArrayList<Bnk1uamDTO>();
    }

    @PostMapping
    public Bnk1uamResponseDTO postMethodName(@RequestBody Bnk1uamDTO entity) {
        return Bnk1uamResponseDTO.builder().bnk1uam("A").bnk1ua("A").company("A").custno("A").sortc("A").accno2("A").opendd("A").openmm("A").openyy("A").lstmtdd("A").lstmtmm("A").lstmtyy("A").nstmtdd("A").nstmtmm("A").nstmtyy("A").avbal("A").actbal("A").message("A").dummy("A").build();
    }

}
