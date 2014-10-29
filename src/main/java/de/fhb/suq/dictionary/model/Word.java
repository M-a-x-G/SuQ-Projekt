package de.fhb.suq.dictionary.model;


import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Created by Max on 28.10.14.
 */


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "word")
public class Word extends BaseModel{

    @NotNull
    private String word;

    @NotNull
    private String description;
}
