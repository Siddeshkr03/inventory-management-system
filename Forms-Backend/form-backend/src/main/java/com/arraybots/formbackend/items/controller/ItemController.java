package com.arraybots.formbackend.items.controller;

import com.arraybots.formbackend.items.model.Item;
import com.arraybots.formbackend.items.service.ItemService;
import com.arraybots.formbackend.items.dto.ItemSupplierDTO;
import com.arraybots.formbackend.supplier.model.Supplier;
import com.arraybots.formbackend.supplier.service.SupplierService;
import com.arraybots.formbackend.category.model.Category;
import com.arraybots.formbackend.category.service.CategoryService;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController

@RequestMapping("/api/items")

@CrossOrigin(origins = "http://localhost:5173")

public class ItemController {

    private final ItemService itemService;
    private final SupplierService supplierService;
    private final CategoryService categoryService;

    public ItemController(ItemService itemService, SupplierService supplierService, CategoryService categoryService) {
        this.itemService = itemService;
        this.supplierService = supplierService;
        this.categoryService = categoryService;
    }

    @PostMapping
    public Item saveItem(
            @RequestBody ItemSupplierDTO dto,
            HttpServletRequest request) {

        // Get the existing supplier using supplierId
        Supplier supplier =
                supplierService.getSupplierById(dto.getSupplierId());

        Category category =
                categoryService.getCategoryById(dto.getCategoryId());

        Item item = dto.getItem();

        item.setSupplier(supplier);
        item.setCategory(category);

        // Save item
        return itemService.saveItem(item, request);
    }

    @GetMapping
    public List<Item> getAllItems(
            @RequestParam(required = false) String productAvailability) {

        return itemService.getAllItems(productAvailability);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {

        itemService.deleteItem(id);

    }

    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {

        return itemService.getItemById(id);

    }

    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id,
                           @RequestBody ItemSupplierDTO dto,
                           HttpServletRequest request) {

        Supplier supplier =
                supplierService.getSupplierById(dto.getSupplierId());

        Category category =
                categoryService.getCategoryById(dto.getCategoryId());

        Item item = dto.getItem();

        item.setSupplier(supplier);
        item.setCategory(category);

        return itemService.updateItem(id, item, request);
    }

}