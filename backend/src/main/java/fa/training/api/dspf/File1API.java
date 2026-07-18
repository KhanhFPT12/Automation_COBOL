

package fa.training.api.dspf;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.dspf.File1DTO;
import fa.training.dto.dspf.response.File1ResponseDTO;
import fa.training.service.dspf.File1Service;
import fa.training.model.dspf.File1;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;


@RestController
@RequestMapping("/File1")
public class File1API  {

    @Autowired
    private File1Service service;

    @GetMapping
    public List<File1DTO> getAll() {
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public File1ResponseDTO postMethodName(@RequestBody File1DTO dto) {
        File1 saved = service.save(toEntity(dto));
        return File1ResponseDTO.builder()
                .f1libl(saved.getF1libl())
                .f1text(saved.getF1text())
                .f1symk(saved.getF1symk())
                .f1yot1(saved.getF1yot1())
                .f1yot2(saved.getF1yot2())
                .f1yot3(saved.getF1yot3())
                .f1yot4(saved.getF1yot4())
                .f1bik1(saved.getF1bik1())
                .f1bik2(saved.getF1bik2())
                .f1bik3(saved.getF1bik3())
                .f1bik4(saved.getF1bik4())
                .f1syyy(saved.getF1syyy())
                .f1symm(saved.getF1symm())
                .f1sydd(saved.getF1sydd())
                .f1tape(saved.getF1tape())
                .f2tape(saved.getF2tape())
                .f3tape(saved.getF3tape())
                .f4tape(saved.getF4tape())
                .f1tpno(saved.getF1tpno())
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private File1DTO toDTO(File1 entity) {
        return File1DTO.builder()
                .f1libl(entity.getF1libl())
                .f1text(entity.getF1text())
                .f1symk(entity.getF1symk())
                .f1yot1(entity.getF1yot1())
                .f1yot2(entity.getF1yot2())
                .f1yot3(entity.getF1yot3())
                .f1yot4(entity.getF1yot4())
                .f1bik1(entity.getF1bik1())
                .f1bik2(entity.getF1bik2())
                .f1bik3(entity.getF1bik3())
                .f1bik4(entity.getF1bik4())
                .f1syyy(entity.getF1syyy())
                .f1symm(entity.getF1symm())
                .f1sydd(entity.getF1sydd())
                .f1tape(entity.getF1tape())
                .f2tape(entity.getF2tape())
                .f3tape(entity.getF3tape())
                .f4tape(entity.getF4tape())
                .f1tpno(entity.getF1tpno())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private File1 toEntity(File1DTO dto) {
        return File1.builder()
                .f1libl(dto.getF1libl())
                .f1text(dto.getF1text())
                .f1symk(dto.getF1symk())
                .f1yot1(dto.getF1yot1())
                .f1yot2(dto.getF1yot2())
                .f1yot3(dto.getF1yot3())
                .f1yot4(dto.getF1yot4())
                .f1bik1(dto.getF1bik1())
                .f1bik2(dto.getF1bik2())
                .f1bik3(dto.getF1bik3())
                .f1bik4(dto.getF1bik4())
                .f1syyy(dto.getF1syyy())
                .f1symm(dto.getF1symm())
                .f1sydd(dto.getF1sydd())
                .f1tape(dto.getF1tape())
                .f2tape(dto.getF2tape())
                .f3tape(dto.getF3tape())
                .f4tape(dto.getF4tape())
                .f1tpno(dto.getF1tpno())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
