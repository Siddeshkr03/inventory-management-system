package com.arraybots.formbackend.items.service;

import com.arraybots.formbackend.items.model.Item;

import java.util.List;

public interface ItemService {

    Item saveItem(Item item);

    List<Item> getAllItems();

    Item getItemById(Long id);

    Item updateItem(Long id, Item item);

    void deleteItem(Long id);


}