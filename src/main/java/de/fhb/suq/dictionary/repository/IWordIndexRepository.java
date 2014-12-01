package de.fhb.suq.dictionary.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

import de.fhb.suq.dictionary.model.WordIndex;

/**
 * Created by Max on 27.11.14.
 */
@RepositoryDefinition(domainClass = WordIndex.class, idClass = Integer.class)
@Transactional(readOnly = true)
public interface IWordIndexRepository extends Repository<WordIndex, Serializable> {
    /**
     * Persists or updates the given {@link de.fhb.suq.dictionary.model.WordIndex} instance.
     *
     * @param wordIndex object
     */
    @Transactional(readOnly = false)
    public WordIndex save(WordIndex wordIndex);

    /**
     * Search a WordIndex object with by keyword
     *
     * @param keyword -> string for search
     * @return WordIndex String
     */
    @Query("SELECT i FROM WordIndex i WHERE i.keyword = :keyword")
    public WordIndex findByKeyword(@Param("keyword") String keyword);

}
