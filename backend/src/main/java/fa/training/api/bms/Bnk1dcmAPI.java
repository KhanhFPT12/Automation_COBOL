

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1dcmDTO;
import fa.training.dto.bms.response.Bnk1dcmResponseDTO;
import fa.training.model.bms.Bnk1dcm;
import fa.training.service.bms.Bnk1dcmService;

import java.util.List;
import java.util.stream.Collectors;

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
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1dcmResponseDTO postMethodName(@RequestBody Bnk1dcmDTO dto) {
        Bnk1dcm saved = service.save(toEntity(dto));
        return Bnk1dcmResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1dcmDTO toDTO(Bnk1dcm entity) {
        return Bnk1dcmDTO.builder()
                .custno(entity.getCustno())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1dcm toEntity(Bnk1dcmDTO dto) {
        return Bnk1dcm.builder()
                .custno(dto.getCustno())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
