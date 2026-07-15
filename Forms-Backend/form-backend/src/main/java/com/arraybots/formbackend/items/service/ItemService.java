package com.arraybots.formbackend.items.service;

import com.arraybots.formbackend.dashboard.dto.RecentItemResponse;
import com.arraybots.formbackend.items.model.Item;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface ItemService {

    Item saveItem(Item item, HttpServletRequest request);

    List<Item> getAllItems(String productAvailability);

    Item getItemById(Long id);

    Item updateItem(Long id, Item item, HttpServletRequest request);

    void deleteItem(Long id);
    
}