package com.arraybots.formbackend.items.model;
import com.arraybots.formbackend.supplier.model.Supplier;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;

    private Double price;

    private Integer quantity;

    private String category;

    private String brand;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private LocalDate purchaseDate;

    private String productCode;

    private String paymentMethod;

    private String productAvailability;

}