package de.fhb.suq.dictionary.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportDTO {
    private List<DefinitionDTO> definitions;
    private String stopwords;
}
