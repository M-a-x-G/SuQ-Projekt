package de.fhb.suq.dictionary.model;



import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import groovy.transform.EqualsAndHashCode;
import lombok.Data;

/**
 * Created by Max on 29.10.14.
 */
@Data
@EqualsAndHashCode
@MappedSuperclass
public abstract class BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

}
