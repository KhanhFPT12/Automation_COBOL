

package fa.training.api.dspf;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.dspf.File2DTO;
import fa.training.dto.dspf.response.File2ResponseDTO;
import fa.training.model.dspf.File2;
import fa.training.service.dspf.File2Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
    

@RestController
@RequestMapping("/File2")
public class File2API  {

    @Autowired
    private File2Service service;

    @GetMapping
    public List<File2DTO> getAll() {
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public File2ResponseDTO postMethodName(@RequestBody File2DTO dto) {
        File2 saved = service.save(toEntity(dto));
        return File2ResponseDTO.builder()
                .dtokc1(saved.getDtokc1())
                .dtokc2(saved.getDtokc2())
                .dtodc2(saved.getDtodc2())
                .dkbn(saved.getDkbn())
                .dtokc3(saved.getDtokc3())
                .wkanmk(saved.getWkanmk())
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private File2DTO toDTO(File2 entity) {
        return File2DTO.builder()
                .dtokc1(entity.getDtokc1())
                .dtokc2(entity.getDtokc2())
                .dtodc2(entity.getDtodc2())
                .dkbn(entity.getDkbn())
                .dtokc3(entity.getDtokc3())
                .wkanmk(entity.getWkanmk())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private File2 toEntity(File2DTO dto) {
        return File2.builder()
                .dtokc1(dto.getDtokc1())
                .dtokc2(dto.getDtokc2())
                .dtodc2(dto.getDtodc2())
                .dkbn(dto.getDkbn())
                .dtokc3(dto.getDtokc3())
                .wkanmk(dto.getWkanmk())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
