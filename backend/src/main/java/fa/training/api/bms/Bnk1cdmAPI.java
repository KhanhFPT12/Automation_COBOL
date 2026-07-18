

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1cdmDTO;
import fa.training.dto.bms.response.Bnk1cdmResponseDTO;
import fa.training.model.bms.Bnk1cdm;
import fa.training.service.bms.Bnk1cdmService;

import java.util.List;
import java.util.stream.Collectors;

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
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1cdmResponseDTO postMethodName(@RequestBody Bnk1cdmDTO dto) {
        Bnk1cdm saved = service.save(toEntity(dto));
        return Bnk1cdmResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1cdmDTO toDTO(Bnk1cdm entity) {
        return Bnk1cdmDTO.builder()
                .accno(entity.getAccno())
                .sign(entity.getSign())
                .amt(entity.getAmt())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1cdm toEntity(Bnk1cdmDTO dto) {
        return Bnk1cdm.builder()
                .accno(dto.getAccno())
                .sign(dto.getSign())
                .amt(dto.getAmt())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
