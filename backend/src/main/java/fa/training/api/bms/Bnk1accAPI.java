

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1accDTO;
import fa.training.dto.bms.response.Bnk1accResponseDTO;
import fa.training.model.bms.Bnk1acc;
import fa.training.service.bms.Bnk1accService;

import java.util.List;
import java.util.stream.Collectors;

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
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1accResponseDTO postMethodName(@RequestBody Bnk1accDTO dto) {
        Bnk1acc saved = service.save(toEntity(dto));
        return Bnk1accResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1accDTO toDTO(Bnk1acc entity) {
        return Bnk1accDTO.builder()
                .custno(entity.getCustno())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1acc toEntity(Bnk1accDTO dto) {
        return Bnk1acc.builder()
                .custno(dto.getCustno())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
