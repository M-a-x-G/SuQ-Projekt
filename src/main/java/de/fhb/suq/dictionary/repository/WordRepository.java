package de.fhb.suq.dictionary.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

import de.fhb.suq.dictionary.model.Word;

/**
 * Created by Max on 29.10.14.
 */
@RepositoryDefinition(domainClass = Word.class, idClass = Long.class)
@Transactional(readOnly = true)
public interface WordRepository extends Repository<Word, Serializable> {

    /**
     * Persists or updates the given {@link Word} instance.
     *
     * @param word object
     */
    @Transactional(readOnly = false)
    public void save(Word word);

    /**
     *
     * @return List of all words
     */

    public List<Word> findAll();

    /**
     *
     *
     * @return paged list
     */
    public List<Word> findAll(Pageable pageable);


    @Query("SELECT w FROM Word w where w.word like :search ORDER BY w.id DESC")
    public List<Word> findAllOrdered(@Param("search") String search, Pageable pageable);

}