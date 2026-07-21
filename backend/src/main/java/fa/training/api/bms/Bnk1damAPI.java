

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1damDTO;
import fa.training.dto.bms.response.Bnk1damResponseDTO;
import fa.training.model.bms.Bnk1dam;
import fa.training.service.bms.Bnk1damService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;


@RestController
@RequestMapping("/Bnk1dam")
public class Bnk1damAPI  {

    @Autowired
    private Bnk1damService service;

    @GetMapping
    public List<Bnk1damDTO> getAll() {
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1damResponseDTO postMethodName(@RequestBody Bnk1damDTO dto) {
        Bnk1dam saved = service.save(toEntity(dto));
        return Bnk1damResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1damDTO toDTO(Bnk1dam entity) {
        return Bnk1damDTO.builder()
                .accno(entity.getAccno())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1dam toEntity(Bnk1damDTO dto) {
        return Bnk1dam.builder()
                .accno(dto.getAccno())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
