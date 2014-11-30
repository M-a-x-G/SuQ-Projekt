package de.fhb.suq.dictionary.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by Max on 20.11.14.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportDTO {
    private List<DefinitionDTO> definitions;
    private String stopwords;
}
