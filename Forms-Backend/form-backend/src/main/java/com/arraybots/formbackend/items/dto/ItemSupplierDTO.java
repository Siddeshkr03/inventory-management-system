package com.arraybots.formbackend.items.dto;

import com.arraybots.formbackend.items.model.Item;
import com.arraybots.formbackend.supplier.model.Supplier;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemSupplierDTO {

    private Item item;

    private Supplier supplier;

    private Long supplierId;

}