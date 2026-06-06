

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1tfmDTO;
import fa.training.dto.bms.response.Bnk1tfmResponseDTO;
import fa.training.service.bms.Bnk1tfmService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1tfm")
public class Bnk1tfmAPI  {

    @Autowired
    private Bnk1tfmService service;

    @GetMapping
    public List<Bnk1tfmDTO> getAll() {
        return new ArrayList<Bnk1tfmDTO>();
    }

    @PostMapping
    public Bnk1tfmResponseDTO postMethodName(@RequestBody Bnk1tfmDTO entity) {
        return Bnk1tfmResponseDTO.builder().bnk1tfm("A").bnk1tf("A").company("A").taccno2("A").factbal("A").tactbal("A").favbal("A").tavbal("A").message("A").dummy("A").faccno2(0).fsortc(0).tsortc(0).build();
    }

}
