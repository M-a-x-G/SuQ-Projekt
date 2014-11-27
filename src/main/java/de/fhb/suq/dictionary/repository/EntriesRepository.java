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
import de.fhb.suq.dictionary.model.Index;
import de.fhb.suq.dictionary.model.Word;

/**
 * Created by Max on 29.10.14.
 */
//@RepositoryDefinition(domainClass = Word.class, idClass = Long.class)
@Transactional(readOnly = true)
public interface EntriesRepository extends Repository<Word, Serializable> {

//    /**
//     * Persists or updates the given {@link Word} instance.
//     *
//     * @param word object
//     */
//    @Transactional(readOnly = false)
//    public Word save(Word word);
//
//    /**
//     * Persists or updates the given {@link de.fhb.suq.dictionary.model.Definition} instance.
//     *
//     * @param definition object
//     */
//    @Transactional(readOnly = false)
//    public void save(Definition definition);
//
//    /**
//     * Persists or updates the given {@link de.fhb.suq.dictionary.model.Index} instance.
//     *
//     * @param index object
//     */
//    @Transactional(readOnly = false)
//    public void save(Index index);
//
//    /**
//     *
//     * @return List of all words
//     */
//    public List<Word> findAll();
//
//    /**
//     *
//     *
//     * @return paged list
//     */
//    public List<Word> findAll(Pageable pageable);
//
//    public Index findByKeyword(String keyword);
//
//
//    @Query("SELECT w FROM Word w where w.word like :search ORDER BY w.id DESC")
//    public List<Word> findAllOrdered(@Param("search") String search, Pageable pageable);

}
