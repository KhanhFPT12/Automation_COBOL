

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1accDTO;
import fa.training.dto.bms.response.Bnk1accResponseDTO;
import fa.training.service.bms.Bnk1accService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1acc")
public class Bnk1accAPI  {

    @Autowired
    private Bnk1accService service;

    @GetMapping
    public List<Bnk1accDTO> getAll() {
        return new ArrayList<Bnk1accDTO>();
    }

    @PostMapping
    public Bnk1accResponseDTO postMethodName(@RequestBody Bnk1accDTO entity) {
        return Bnk1accResponseDTO.builder().bnk1acc("A").company("A").account("A").message("A").dummy("A").build();
    }

}
