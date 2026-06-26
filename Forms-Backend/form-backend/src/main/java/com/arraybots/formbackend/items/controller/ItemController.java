package com.arraybots.formbackend.items.controller;

import com.arraybots.formbackend.items.model.Item;
import com.arraybots.formbackend.items.service.ItemService;
import com.arraybots.formbackend.items.dto.ItemSupplierDTO;
import com.arraybots.formbackend.supplier.model.Supplier;
import com.arraybots.formbackend.supplier.service.SupplierService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/items")

@CrossOrigin(origins = "http://localhost:5173")

public class ItemController {

    private final ItemService itemService;
    private final SupplierService supplierService;

    public ItemController(ItemService itemService, SupplierService supplierService) {
        this.itemService = itemService;
        this.supplierService = supplierService;
    }

    @PostMapping
    public Item saveItem(@RequestBody ItemSupplierDTO dto) {

        // Save supplier first
        Supplier supplier = supplierService.saveSupplier(dto.getSupplier());

        // Get item from DTO
        Item item = dto.getItem();

        // Link supplier to item
        item.setSupplier(supplier);

        // Save item
        return itemService.saveItem(item);
    }

    @GetMapping

    public List<Item> getAllItems() {

        return itemService.getAllItems();

    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {

        itemService.deleteItem(id);

    }

    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {

        return itemService.getItemById(id);

    }

}