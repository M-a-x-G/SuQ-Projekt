package de.fhb.suq.dictionary.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import de.fhb.suq.dictionary.dto.DefinitionDTO;
import de.fhb.suq.dictionary.dto.EntriesDTO;
import de.fhb.suq.dictionary.service.EntriesService;


/**
 * Created by Max on 27.10.14.
 */


@RestController
public class DictionaryController {

    @Autowired
    private EntriesService entriesService;


    @RequestMapping(value = "/entries", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<String> addEntries(@RequestBody EntriesDTO dto) {

        entriesService.createUpdateEntries(dto);

        return new ResponseEntity<>("Everything added",HttpStatus.ACCEPTED);

    }


    @RequestMapping(value = "/entries", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<EntriesDTO> getEntries() {
        List<String> words = new ArrayList<>();
        List<DefinitionDTO> definitionDTOs = new ArrayList<>();
        List<String> word2def = new ArrayList<>();
        List<String> word1def = new ArrayList<>();
        word1def.add("word1def1");
        word1def.add("word1def2");
        word2def.add("word2def1");
        word2def.add("word2def2");

        definitionDTOs.add(new DefinitionDTO("word1", word1def));
        definitionDTOs.add(new DefinitionDTO("word2", word2def));
        return new ResponseEntity<>(new EntriesDTO(definitionDTOs, "stopwordRegex"), HttpStatus.OK);
//        StringBuilder stringBuilder = new StringBuilder();
//        for (Word word : wordService.findAll()) {
//            stringBuilder.append(word.getWord());
//        }
//        return stringBuilder.toString();
    }

//
//    @RequestMapping("/save")
//    @ResponseBody
//    String saveWord(@RequestParam(value = "word") String word, @RequestParam(value = "description") String description) {
//        wordService.createWord(new Word(word, description));
//        return word + ": " + description + " saved";
//    }
}
