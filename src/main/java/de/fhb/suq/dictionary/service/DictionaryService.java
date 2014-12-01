package de.fhb.suq.dictionary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

import de.fhb.suq.dictionary.dto.DefinitionDTO;
import de.fhb.suq.dictionary.dto.ImportDTO;
import de.fhb.suq.dictionary.model.Definition;
import de.fhb.suq.dictionary.model.Word;
import de.fhb.suq.dictionary.model.WordIndex;
import de.fhb.suq.dictionary.repository.DefinitionRepository;
import de.fhb.suq.dictionary.repository.WordIndexRepository;
import de.fhb.suq.dictionary.repository.WordRepository;

@Component
@Service
public class DictionaryService {

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private DefinitionRepository definitionRepository;

    @Autowired
    private WordIndexRepository wordIndexRepository;


    /**
     * Get all words and definitions from DB
     * @return List of DefinitionDTOs
     */
    public List<DefinitionDTO> findAllWords() {
        List<Word> words = wordRepository.findAll();
        return DTOMapper.mapWordListToDefinitionDTOList(words);
    }

    /**
     * Get a list of words end definitions
     * @param query -> text for search
     * @return List of DefinitionDTOs
     */
    public List<DefinitionDTO> findWordsByWord(String query) {
        List<Word> words = wordRepository.findBySearchString(query);
        return DTOMapper.mapWordListToDefinitionDTOList(words);
    }

    /**
     * Create or update DB with given entries
     * @param importDTO entries to add
     */
    public void createUpdateEntries(ImportDTO importDTO) {
        final List<DefinitionDTO> definitions = importDTO.getDefinitions();
        for (DefinitionDTO definitionDTO : definitions) {
            Definition definition;
            Word word;
            try {
                word = wordRepository.save(new Word(definitionDTO.getWord(), null));
            } catch (DataIntegrityViolationException e) {
                word = wordRepository.findByWord(definitionDTO.getWord());
            }
            List<String> definitionStringList = definitionDTO.getDefinitions();
            for (String definitionString : definitionStringList) {
                definition = definitionRepository.findByValue(definitionString);
                if (definition == null) {
                    definition = new Definition();
                    definition.setValue(definitionString);
                    if (word.getDefinitions() == null) {
                        word.setDefinitions(new HashSet<>());
                    }
                    word.getDefinitions().add(definition);
                    definition = definitionRepository.save(definition);
                }
                if (definition.getWordIndexes() == null) {
                    definition.setWordIndexes(new HashSet<>());
                }

                definitionString = definitionString.replaceAll("[,.]", "");
                definitionString = definitionString.replaceAll(importDTO.getStopwords(), "");
                for (String keyword : definitionString.split("[ ]")) {
                    WordIndex wordIndex = wordIndexRepository.findByKeyword(keyword);
                    if (wordIndex == null) {
                        wordIndex = new WordIndex();
                        wordIndex.setKeyword(keyword);
                        wordIndex = wordIndexRepository.save(wordIndex);
                    }
                    definition.getWordIndexes().add(wordIndex);
                }

            }

        }
    }


}
