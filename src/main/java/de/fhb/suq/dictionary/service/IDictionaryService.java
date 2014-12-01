package de.fhb.suq.dictionary.service;

import java.util.List;

import de.fhb.suq.dictionary.dto.DefinitionDTO;
import de.fhb.suq.dictionary.dto.ImportDTO;

/**
 * Created by Max on 01.12.14.
 */
public interface IDictionaryService {

    public List<DefinitionDTO> findAllWords();

    public List<DefinitionDTO> findWordsByWord(String query);

    public void createUpdateEntries(ImportDTO importDTO);
}
