

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1camDTO;
import fa.training.dto.bms.response.Bnk1camResponseDTO;
import fa.training.model.bms.Bnk1cam;
import fa.training.service.bms.Bnk1camService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1cam")
public class Bnk1camAPI  {

    @Autowired
    private Bnk1camService service;

    @GetMapping
    public List<Bnk1camDTO> getAll() {
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1camResponseDTO postMethodName(@RequestBody Bnk1camDTO dto) {
        Bnk1cam saved = service.save(toEntity(dto));
        return Bnk1camResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1camDTO toDTO(Bnk1cam entity) {
        return Bnk1camDTO.builder()
                .custno(entity.getCustno())
                .acctyp(entity.getAcctyp())
                .intrt(entity.getIntrt())
                .overdr(entity.getOverdr())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1cam toEntity(Bnk1camDTO dto) {
        return Bnk1cam.builder()
                .custno(dto.getCustno())
                .acctyp(dto.getAcctyp())
                .intrt(dto.getIntrt())
                .overdr(dto.getOverdr())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
