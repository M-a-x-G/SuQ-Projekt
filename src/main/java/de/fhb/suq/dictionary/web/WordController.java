package de.fhb.suq.dictionary.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;

import de.fhb.suq.dictionary.model.Word;
import de.fhb.suq.dictionary.service.WordService;


/**
 * Created by Max on 27.10.14.
 */


@Controller
//@EnableAutoConfiguration
public class WordController {

    @Inject
    private WordService wordService;

    @RequestMapping("/")
    @ResponseBody
    String home() {
        StringBuilder stringBuilder = new StringBuilder();
        for (Word word : wordService.findAll()) {
            stringBuilder.append(word.getWord());
        }
        return stringBuilder.toString();
    }

    @RequestMapping("/save")
    @ResponseBody
    String saveWord(@RequestParam(value = "word") String word, @RequestParam(value = "description") String description) {
        wordService.createWord(new Word(word,description));
        return word + ": " + description + " saved";
    }

//    public static void main(String[] args) throws Exception {
//        SpringApplication.run(WordController.class, args);
//    }
}
