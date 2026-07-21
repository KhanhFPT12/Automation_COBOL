

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1maiDTO;
import fa.training.dto.bms.response.Bnk1maiResponseDTO;
import fa.training.model.bms.Bnk1mai;
import fa.training.service.bms.Bnk1maiService;

import java.util.List;
import java.util.stream.Collectors;

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
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1maiResponseDTO postMethodName(@RequestBody Bnk1maiDTO dto) {
        Bnk1mai saved = service.save(toEntity(dto));
        return Bnk1maiResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1maiDTO toDTO(Bnk1mai entity) {
        return Bnk1maiDTO.builder()
                .action(entity.getAction())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1mai toEntity(Bnk1maiDTO dto) {
        return Bnk1mai.builder()
                .action(dto.getAction())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
