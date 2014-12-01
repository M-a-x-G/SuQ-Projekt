package de.fhb.suq.dictionary.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

import de.fhb.suq.dictionary.model.Definition;
import de.fhb.suq.dictionary.model.WordIndex;
import de.fhb.suq.dictionary.model.Word;

@RepositoryDefinition(domainClass = Word.class, idClass = Integer.class)
@Transactional(readOnly = true)
public interface WordRepository extends Repository<Word, Serializable> {

    /**
     * Persists or updates the given {@link Word} instance.
     *
     * @param word object
     */
    @Transactional(readOnly = false)
    public Word save(Word word);

    /**
     * Find all words
     * @return List of all words
     */
    public List<Word> findAll();

    /**
     *  Find all words(pageable)
     *
     * @return paged list
     */
    public List<Word> findAll(Pageable pageable);

    /**
     * Find Word object with given word
     * @param Word for search
     * @return Word object
     */
    public Word findByWord(String Word);


    /**
     * Search for words like search string
     * @param search text
     * @return List of Word objects
     */
    @Query("SELECT w FROM Word w WHERE lower(w.word) LIKE CONCAT('%', LOWER(:search), '%') ORDER BY w.id DESC")
    public List<Word> findBySearchString(@Param("search") String search);

}
