package com.arraybots.formbackend.items.service;

import com.arraybots.formbackend.items.model.Item;
import com.arraybots.formbackend.items.repository.ItemRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    public ItemServiceImpl(ItemRepository itemRepository) {

        this.itemRepository = itemRepository;

    }

    @Override
    public Item saveItem(Item item) {

        return itemRepository.save(item);

    }

    @Override
    public List<Item> getAllItems() {

        return itemRepository.findAll();

    }

    @Override
    public void deleteItem(Long id) {

        itemRepository.deleteById(id);

    }

    @Override
    public Item getItemById(Long id) {

        return itemRepository.findById(id).orElse(null);

    }

    @Override
    public Item updateItem(Long id, Item item) {

        item.setId(id);

        return itemRepository.save(item);

    }

}