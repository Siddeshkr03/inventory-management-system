package com.arraybots.formbackend.items.controller;

import com.arraybots.formbackend.items.model.Item;
import com.arraybots.formbackend.items.service.ItemService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/items")

@CrossOrigin(origins = "http://localhost:5173")

public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {

        this.itemService = itemService;

    }

    @PostMapping

    public Item saveItem(@RequestBody Item item) {

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