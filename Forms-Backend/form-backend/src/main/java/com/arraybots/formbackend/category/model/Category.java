package com.arraybots.formbackend.category.model;

import com.arraybots.formbackend.common.model.AuditEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "category")
public class Category extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name", nullable = false, unique = true)
    private String categoryName;

    @Column(name = "category_code", nullable = false, unique = true)
    private String categoryCode;

    @Column(length = 255)
    private String description;
}