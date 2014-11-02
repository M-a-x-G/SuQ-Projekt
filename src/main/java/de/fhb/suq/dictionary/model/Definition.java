package de.fhb.suq.dictionary.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Created by Max on 02.11.14.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "definition")
public class Definition extends BaseModel {

    @NotNull
    private String value;

    @ManyToOne
    @JoinColumn(name = "word_id", nullable = false)
    private Word word;

    @ManyToMany
    @JoinTable(name = "index_to_definition", joinColumns = {@JoinColumn(name = "definition_id")}, inverseJoinColumns = @JoinColumn(name = "index_id"))
    private Set<Index> indexes = new HashSet<>();

}
