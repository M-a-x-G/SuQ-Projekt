package de.fhb.suq.dictionary.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import de.fhb.suq.dictionary.service.WordService;


/**
 * Created by Max on 27.10.14.
 */


@RestController
public class WordController {

    @Autowired
    private WordService wordService;

//    @RequestMapping("/show")
//    @ResponseBody
//    String home() {
//        StringBuilder stringBuilder = new StringBuilder();
//        for (Word word : wordService.findAll()) {
//            stringBuilder.append(word.getWord());
//        }
//        return stringBuilder.toString();
//    }
//
//    @RequestMapping("/save")
//    @ResponseBody
//    String saveWord(@RequestParam(value = "word") String word, @RequestParam(value = "description") String description) {
//        wordService.createWord(new Word(word, description));
//        return word + ": " + description + " saved";
//    }
}
