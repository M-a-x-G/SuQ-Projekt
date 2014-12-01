package de.fhb.suq.dictionary.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import de.fhb.suq.dictionary.dto.DefinitionDTO;
import de.fhb.suq.dictionary.model.Definition;
import de.fhb.suq.dictionary.model.Word;

/**
 * Created by Max on 01.12.14.
 */
public class DTOMapper {

    public static List<DefinitionDTO> mapWordListToDefinitionDTOList(List<Word> words){
        List<DefinitionDTO> out = new ArrayList<>();
        for (Word word : words) {
            List<String> definitions = word.getDefinitions().stream().map(Definition::getValue).collect(Collectors.toList());
            out.add(new DefinitionDTO(word.getWord(), definitions));
        }
        return out;
    }


}
