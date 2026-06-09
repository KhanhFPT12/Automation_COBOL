

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1cdmDTO;
import fa.training.dto.bms.response.Bnk1cdmResponseDTO;
import fa.training.service.bms.Bnk1cdmService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1cdm")
public class Bnk1cdmAPI  {

    @Autowired
    private Bnk1cdmService service;

    @GetMapping
    public List<Bnk1cdmDTO> getAll() {
        return new ArrayList<Bnk1cdmDTO>();
    }

    @PostMapping
    public Bnk1cdmResponseDTO postMethodName(@RequestBody Bnk1cdmDTO entity) {
        return Bnk1cdmResponseDTO.builder().bnk1cdm("A").bnk1cd("A").company("A").avbal("A").actbal("A").message("A").dummy("A").sortc(0).build();
    }

}
