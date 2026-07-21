

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1b2mDTO;
import fa.training.dto.bms.response.Bnk1b2mResponseDTO;
import fa.training.model.bms.Bnk1b2m;
import fa.training.service.bms.Bnk1b2mService;

import java.util.List;
import java.util.stream.Collectors;

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
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1b2mResponseDTO postMethodName(@RequestBody Bnk1b2mDTO dto) {
        Bnk1b2m saved = service.save(toEntity(dto));
        return Bnk1b2mResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1b2mDTO toDTO(Bnk1b2m entity) {
        return Bnk1b2mDTO.builder()
                .faccno(entity.getFaccno())
                .amt(entity.getAmt())
                .taccno(entity.getTaccno())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1b2m toEntity(Bnk1b2mDTO dto) {
        return Bnk1b2m.builder()
                .faccno(dto.getFaccno())
                .amt(dto.getAmt())
                .taccno(dto.getTaccno())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
