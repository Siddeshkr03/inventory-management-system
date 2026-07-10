package com.arraybots.formbackend.items.model;
import com.arraybots.formbackend.common.model.AuditEntity;
import com.arraybots.formbackend.supplier.model.Supplier;
import com.arraybots.formbackend.category.model.Category;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "items")
public class Item extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;

    private Double price;

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String brand;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private LocalDate purchaseDate;

    private String productCode;

    private String paymentMethod;

    private String productAvailability;

    private String files;

}