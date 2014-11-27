package de.fhb.suq.dictionary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

import de.fhb.suq.dictionary.dto.DefinitionDTO;
import de.fhb.suq.dictionary.dto.EntriesDTO;
import de.fhb.suq.dictionary.model.Definition;
import de.fhb.suq.dictionary.model.Word;
import de.fhb.suq.dictionary.model.WordIndex;
import de.fhb.suq.dictionary.repository.DefinitionRepository;
import de.fhb.suq.dictionary.repository.WordIndexRepository;
import de.fhb.suq.dictionary.repository.WordRepository;

/**
 * Created by Max on 29.10.14.
 */
@Component
@Service
public class EntriesService {

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private DefinitionRepository definitionRepository;

    @Autowired
    private WordIndexRepository wordIndexRepository;


    public void createUpdateEntries(EntriesDTO entriesDTO) {
        final List<DefinitionDTO> definitions = entriesDTO.getDefinitions();
        for (DefinitionDTO definitionDTO : definitions) {
            Definition definition;
            //Try catch word exist
            Word word = wordRepository.save(new Word(definitionDTO.getWord()));

            List<String> definitionStringList = definitionDTO.getDefinitions();
            for (String definitionString : definitionStringList) {

                definition = definitionRepository.findByValue(definitionString);
                if (definition == null){
                    definition = new Definition();
                    definition.setWord(word);
                    definition.setValue(definitionString);
                }

                definitionString = definitionString.replaceAll("[,.]", "");
                definitionString = definitionString.replaceAll(entriesDTO.getStopwords(), "");
                for (String keyword : definitionString.split("[ ]")) {
                    WordIndex wordIndex = wordIndexRepository.findByKeyword(keyword);
                    if (wordIndex == null) {
                        wordIndex = new WordIndex();
                        HashSet<Definition> definitionHashSet = new HashSet<>();
                        definitionHashSet.add(definition);
                        wordIndex.setKeyword(keyword);
                        wordIndex.setDefinitions(definitionHashSet);
                        wordIndexRepository.save(wordIndex);
                    } else {
                        wordIndex.getDefinitions().add(definition);
                    }
                }
            }
        }
    }


}
