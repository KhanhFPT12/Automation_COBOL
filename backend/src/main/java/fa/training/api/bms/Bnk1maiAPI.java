

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1maiDTO;
import fa.training.dto.bms.response.Bnk1maiResponseDTO;
import fa.training.service.bms.Bnk1maiService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1mai")
public class Bnk1maiAPI  {

    @Autowired
    private Bnk1maiService service;

    @GetMapping
    public List<Bnk1maiDTO> getAll() {
        return new ArrayList<Bnk1maiDTO>();
    }

    @PostMapping
    public Bnk1maiResponseDTO postMethodName(@RequestBody Bnk1maiDTO entity) {
        return Bnk1maiResponseDTO.builder().bnk1mai("A").bnk1me("A").company("A").message("A").dummy("A").build();
    }

}
