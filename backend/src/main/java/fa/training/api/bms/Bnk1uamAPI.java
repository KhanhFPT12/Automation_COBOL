

package fa.training.api.bms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.bms.Bnk1uamDTO;
import fa.training.dto.bms.response.Bnk1uamResponseDTO;
import fa.training.model.bms.Bnk1uam;
import fa.training.service.bms.Bnk1uamService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/Bnk1uam")
public class Bnk1uamAPI  {

    @Autowired
    private Bnk1uamService service;

    @GetMapping
    public List<Bnk1uamDTO> getAll() {
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Bnk1uamResponseDTO postMethodName(@RequestBody Bnk1uamDTO dto) {
        Bnk1uam saved = service.save(toEntity(dto));
        return Bnk1uamResponseDTO.builder()
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private Bnk1uamDTO toDTO(Bnk1uam entity) {
        return Bnk1uamDTO.builder()
                .accno(entity.getAccno())
                .actype(entity.getActype())
                .intrt(entity.getIntrt())
                .overdr(entity.getOverdr())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Bnk1uam toEntity(Bnk1uamDTO dto) {
        return Bnk1uam.builder()
                .accno(dto.getAccno())
                .actype(dto.getActype())
                .intrt(dto.getIntrt())
                .overdr(dto.getOverdr())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
