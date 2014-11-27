package de.fhb.suq.dictionary.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
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
@Table(name = "word_index")
public class Index extends BaseModel{

    @NotNull
    @Column(unique = true)
    private String keyword;

    @ManyToMany(mappedBy = "indexes")
    private Set<Definition> definitions = new HashSet<>();

}
