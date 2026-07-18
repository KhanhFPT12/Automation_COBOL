

package fa.training.api.dspf;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.dspf.WordDTO;
import fa.training.dto.dspf.response.WordResponseDTO;
import fa.training.model.dspf.Word;
import fa.training.service.dspf.WordService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;


@RestController
@RequestMapping("/Word")
public class WordAPI  {

    @Autowired
    private WordService service;

    @GetMapping
    public List<WordDTO> getAll() {
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public WordResponseDTO postMethodName(@RequestBody WordDTO dto) {
        Word saved = service.save(toEntity(dto));
        return WordResponseDTO.builder()
                .id_cli(saved.getId_cli())
                .screenIdField(saved.getScreenIdField())
                .build();
    }

    private WordDTO toDTO(Word entity) {
        return WordDTO.builder()
                .option(entity.getOption())
                .id_cli(entity.getId_cli())
                .screenIdField(entity.getScreenIdField())
                .build();
    }

    private Word toEntity(WordDTO dto) {
        return Word.builder()
                .option(dto.getOption())
                .id_cli(dto.getId_cli())
                .screenIdField(dto.getScreenIdField())
                .build();
    }

}
