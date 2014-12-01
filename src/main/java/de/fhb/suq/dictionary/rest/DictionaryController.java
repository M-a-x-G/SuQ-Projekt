package de.fhb.suq.dictionary.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import de.fhb.suq.dictionary.dto.DefinitionDTO;
import de.fhb.suq.dictionary.dto.ImportDTO;
import de.fhb.suq.dictionary.service.IDictionaryService;


@RestController
public class DictionaryController {

    @Autowired
    private IDictionaryService dictionaryService;


    /**
     * Endpoint for adding entries to DB
     *
     * @param dto parsed from JSON request
     * @return response for client
     */
    @RequestMapping(value = "/entries", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<String> addEntries(@RequestBody ImportDTO dto) {
        dictionaryService.createUpdateEntries(dto);
        return new ResponseEntity<>("Alle Elemente hinzugefügt", HttpStatus.OK);
    }


    /**
     * Endpoint for getting entries (all/byQuery)
     *
     * @param query -> text for search or empty
     * @return List of DefinitionDTOs as JSON to client
     */
    @RequestMapping(value = "/entries", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<DefinitionDTO>> getEntries(@RequestParam(defaultValue = "") String query) {
        ResponseEntity<List<DefinitionDTO>> out;
        if (query == null || query.isEmpty()) {
            out = new ResponseEntity<>(dictionaryService.findAllWords(), HttpStatus.OK);
        } else {
            List<DefinitionDTO> definitionDTOs = dictionaryService.findWordsByWord(query);
            if (definitionDTOs == null || definitionDTOs.isEmpty()) {
                out = new ResponseEntity<>(definitionDTOs, HttpStatus.NO_CONTENT);
            } else {
                out = new ResponseEntity<>(definitionDTOs, HttpStatus.OK);
            }
        }

        return out;
    }
}
