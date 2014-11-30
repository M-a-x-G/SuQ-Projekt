package de.fhb.suq.dictionary.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import de.fhb.suq.dictionary.dto.DefinitionDTO;
import de.fhb.suq.dictionary.dto.ImportDTO;
import de.fhb.suq.dictionary.service.DictionaryService;


/**
 * Created by Max on 27.10.14.
 */


@RestController
public class DictionaryController {

    @Autowired
    private DictionaryService dictionaryService;


    @RequestMapping(value = "/entries", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<String> addEntries(@RequestBody ImportDTO dto) {
        dictionaryService.createUpdateEntries(dto);
        return new ResponseEntity<>("Everything added",HttpStatus.OK);
    }

    @RequestMapping(value = "/entries", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<DefinitionDTO>> getEntries() {
        return new ResponseEntity<>(dictionaryService.findAllWords(), HttpStatus.OK);
    }
}
