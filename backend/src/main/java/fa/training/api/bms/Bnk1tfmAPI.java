

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1tfmDTO;
import fa.training.dto.bms.response.Bnk1tfmResponseDTO;
import fa.training.model.bms.Bnk1tfm;
import fa.training.service.bms.Bnk1tfmService;

import java.util.List;
import java.util.stream.Collectors;

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
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1tfmResponseDTO postMethodName(@RequestBody Bnk1tfmDTO dto) {
        Bnk1tfm saved = service.save(toEntity(dto));
        return Bnk1tfmResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1tfmDTO toDTO(Bnk1tfm entity) {
        return Bnk1tfmDTO.builder()
                .faccno(entity.getFaccno())
                .taccno(entity.getTaccno())
                .amt(entity.getAmt())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1tfm toEntity(Bnk1tfmDTO dto) {
        return Bnk1tfm.builder()
                .faccno(dto.getFaccno())
                .taccno(dto.getTaccno())
                .amt(dto.getAmt())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
