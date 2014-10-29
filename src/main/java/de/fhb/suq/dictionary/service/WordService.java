package de.fhb.suq.dictionary.service;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

import javax.inject.Inject;

import de.fhb.suq.dictionary.model.Word;
import de.fhb.suq.dictionary.repository.WordRepository;
import lombok.extern.slf4j.Slf4j;

/**
 * Created by Max on 29.10.14.
 */
@Slf4j
@Component
@Service
public class WordService {

    @Inject
    private WordRepository wordRepository;

    public void createWord(Word word){
        wordRepository.save(word);
    }

    public List<Word> findAll(){
        return wordRepository.findAll();
    }

//    public List<Word> findAll(Pageable pageable){
//        return wordRepository.findAll(pageable);
//    }

}
