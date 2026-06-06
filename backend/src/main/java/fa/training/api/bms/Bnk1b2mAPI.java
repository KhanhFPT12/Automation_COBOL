

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1b2mDTO;
import fa.training.dto.bms.response.Bnk1b2mResponseDTO;
import fa.training.service.bms.Bnk1b2mService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1b2m")
public class Bnk1b2mAPI  {

    @Autowired
    private Bnk1b2mService service;

    @GetMapping
    public List<Bnk1b2mDTO> getAll() {
        return new ArrayList<Bnk1b2mDTO>();
    }

    @PostMapping
    public Bnk1b2mResponseDTO postMethodName(@RequestBody Bnk1b2mDTO entity) {
        return Bnk1b2mResponseDTO.builder().bnk1tfm("A").bnk1b2("A").company("A").fscde1("A").fscde2("A").fscde3("A").actsign("A").avasign("A").tscde1("A").tscde2("A").message("A").dummy("A").actpnd(0).actpnc(0).avapnd(0).avapnc(0).tscde3(0).build();
    }

}
