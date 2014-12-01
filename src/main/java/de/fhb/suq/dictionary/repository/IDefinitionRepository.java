package de.fhb.suq.dictionary.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

import de.fhb.suq.dictionary.model.Definition;

@RepositoryDefinition(domainClass = Definition.class, idClass = Integer.class)
@Transactional(readOnly = true)
public interface IDefinitionRepository extends Repository<Definition, Serializable> {

    /**
     * Persists or updates the given {@link de.fhb.suq.dictionary.model.Definition} instance.
     *
     * @param definition object
     */
    @Transactional(readOnly = false)
    public Definition save(Definition definition);

    /**
     * Get all Definitions in DB
     *
     * @return List of Definition objects
     */
    public List<Definition> findAll();

    /**
     * Find a Definition object by its value
     *
     * @param value for search
     * @return Definition object
     */
    @Query("SELECT d FROM Definition d WHERE d.value = :definition")
    public Definition findByValue(@Param("definition") String value);

}
