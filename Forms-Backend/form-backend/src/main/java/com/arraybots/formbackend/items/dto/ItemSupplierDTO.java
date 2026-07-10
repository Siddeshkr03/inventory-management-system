package com.arraybots.formbackend.items.dto;

import com.arraybots.formbackend.items.model.Item;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemSupplierDTO {

    private Item item;

    private Long supplierId;

    private Long categoryId;
}