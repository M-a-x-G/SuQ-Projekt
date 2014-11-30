package de.fhb.suq.dictionary.model;


import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by Max on 29.10.14.
 */
@Setter
@Getter
@MappedSuperclass
public abstract class BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected int id;


    @Override
    public boolean equals(Object o) {

        if(o == null || !(o instanceof BaseModel)){
            return false;
        }

        return getId() == ((BaseModel) o).getId();
    }

    @Override
    public int hashCode() {
        return id;
    }
}
