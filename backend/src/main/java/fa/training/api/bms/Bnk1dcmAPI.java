

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1dcmDTO;
import fa.training.dto.bms.response.Bnk1dcmResponseDTO;
import fa.training.service.bms.Bnk1dcmService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1dcm")
public class Bnk1dcmAPI  {

    @Autowired
    private Bnk1dcmService service;

    @GetMapping
    public List<Bnk1dcmDTO> getAll() {
        return new ArrayList<Bnk1dcmDTO>();
    }

    @PostMapping
    public Bnk1dcmResponseDTO postMethodName(@RequestBody Bnk1dcmDTO entity) {
        return Bnk1dcmResponseDTO.builder().bnk1dcm("A").bnk1dc("A").company("A").sortc("A").custno2("A").custnam("A").custad1("A").custad2("A").custad3("A").dobdd("A").dobmm("A").dobyy("A").credsc("A").scrdtdd("A").scrdtmm("A").scrdtyy("A").message("A").dummy("A").build();
    }

}
