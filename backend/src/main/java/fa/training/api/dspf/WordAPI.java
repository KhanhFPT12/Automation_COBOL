

package fa.training.api.dspf;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fa.training.dto.dspf.WordDTO;
import fa.training.dto.dspf.response.WordResponseDTO;
import fa.training.service.dspf.WordService;

import java.util.ArrayList;
import java.util.List;

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
        return new ArrayList<WordDTO>();
    }

    @PostMapping
    public WordResponseDTO postMethodName(@RequestBody WordDTO entity) {
        return WordResponseDTO.builder().id_crd("A").shop_crd("A").name_shp("A").id_cli("A").build();
    }

}
