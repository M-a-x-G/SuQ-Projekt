package de.fhb.suq.dictionary.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import de.fhb.suq.dictionary.dto.DefinitionDTO;
import de.fhb.suq.dictionary.model.Word;

public class DTOMapper {

    /**
     * Map a list with words definitions to a list with DefinitionDTOs
     * @param words list
     * @return List of DefinitionDTOs
     */
    public static List<DefinitionDTO> mapWordListToDefinitionDTOList(List<Word> words){
        List<DefinitionDTO> out = new ArrayList<>();
        for (Word word : words) {
            List<String> definitions = word.getDefinitions().stream().map(Definition::getValue).collect(Collectors.toList());
            out.add(new DefinitionDTO(word.getWord(), definitions));
        }
        return out;
    }


}
