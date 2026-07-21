

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1ccmDTO;
import fa.training.dto.bms.response.Bnk1ccmResponseDTO;
import fa.training.model.bms.Bnk1ccm;
import fa.training.service.bms.Bnk1ccmService;

import java.util.List;
import java.util.stream.Collectors;

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
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1ccmResponseDTO postMethodName(@RequestBody Bnk1ccmDTO dto) {
        Bnk1ccm saved = service.save(toEntity(dto));
        return Bnk1ccmResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1ccmDTO toDTO(Bnk1ccm entity) {
        return Bnk1ccmDTO.builder()
                .custtit(entity.getCusttit())
                .christn(entity.getChristn())
                .custins(entity.getCustins())
                .custsn(entity.getCustsn())
                .custad1(entity.getCustad1())
                .custad2(entity.getCustad2())
                .custad3(entity.getCustad3())
                .dobdd(entity.getDobdd())
                .dobmm(entity.getDobmm())
                .dobyy(entity.getDobyy())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1ccm toEntity(Bnk1ccmDTO dto) {
        return Bnk1ccm.builder()
                .custtit(dto.getCusttit())
                .christn(dto.getChristn())
                .custins(dto.getCustins())
                .custsn(dto.getCustsn())
                .custad1(dto.getCustad1())
                .custad2(dto.getCustad2())
                .custad3(dto.getCustad3())
                .dobdd(dto.getDobdd())
                .dobmm(dto.getDobmm())
                .dobyy(dto.getDobyy())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
