package de.fhb.suq.dictionary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

import de.fhb.suq.dictionary.dto.DefinitionDTO;
import de.fhb.suq.dictionary.dto.EntriesDTO;
import de.fhb.suq.dictionary.model.Definition;
import de.fhb.suq.dictionary.model.Index;
import de.fhb.suq.dictionary.model.Word;
import de.fhb.suq.dictionary.repository.EntriesRepository;
import lombok.extern.slf4j.Slf4j;

/**
 * Created by Max on 29.10.14.
 */
@Component
@Service
public class EntriesService {

    @Autowired
    private EntriesRepository entriesRepository;


//    public void createUpdateEntries(EntriesDTO entriesDTO) {
//        final List<DefinitionDTO> definitions = entriesDTO.getDefinitions();
//        for (DefinitionDTO definitionDTO : definitions) {
//            Definition definition = new Definition();
//            //TODO Try
//            Word word = entriesRepository.save(new Word(definitionDTO.getWort()));
//            List<String> definitionStringList = definitionDTO.getDefinitions();
//            for (String definitionString : definitionStringList) {
//
//                //TODO Try find
//                definition.setWord(word);
//                definition.setValue(definitionString);
//                definitionString = definitionString.replaceAll("[,.]", "");
//                definitionString = definitionString.replaceAll(entriesDTO.getStopwords(), "");
//                for (String keyword : definitionString.split("[ ]")) {
//                    Index index = entriesRepository.findByKeyword(keyword);
//                    if (index == null) {
//                        index = new Index();
//                        HashSet<Definition> definitionHashSet = new HashSet<>();
//                        definitionHashSet.add(definition);
//                        index.setKeyword(keyword);
//                        index.setDefinitions(definitionHashSet);
//                        entriesRepository.save(index);
//                    }else{
//                        index.getDefinitions().add(definition);
//                    }
////                    definition.se
//                }
//            }
//        }
//    }

//    public List<EntriesDTO> findAll() {
//
//        return entriesRepository.findAll();
//    }

//    public List<Word> findAll(Pageable pageable){
//        return wordRepository.findAll(pageable);
//    }

//    private
}
