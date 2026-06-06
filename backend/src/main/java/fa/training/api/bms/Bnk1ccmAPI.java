

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1ccmDTO;
import fa.training.dto.bms.response.Bnk1ccmResponseDTO;
import fa.training.service.bms.Bnk1ccmService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1ccm")
public class Bnk1ccmAPI  {

    @Autowired
    private Bnk1ccmService service;

    @GetMapping
    public List<Bnk1ccmDTO> getAll() {
        return new ArrayList<Bnk1ccmDTO>();
    }

    @PostMapping
    public Bnk1ccmResponseDTO postMethodName(@RequestBody Bnk1ccmDTO entity) {
        return Bnk1ccmResponseDTO.builder().bnk1ccm("A").bnk1cc("A").company("A").message("A").dummy("A").sortc(0).custno2(0).credsc(0).scrdtdd(0).scrdtmm(0).scrdtyy(0).build();
    }

}
