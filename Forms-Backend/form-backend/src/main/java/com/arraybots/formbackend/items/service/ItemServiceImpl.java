package com.arraybots.formbackend.items.service;

import com.arraybots.formbackend.dashboard.dto.RecentItemResponse;
import com.arraybots.formbackend.items.model.Item;
import com.arraybots.formbackend.items.repository.ItemRepository;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.arraybots.formbackend.user.model.User;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    public ItemServiceImpl(ItemRepository itemRepository) {

        this.itemRepository = itemRepository;

    }

    @Override
    public Item saveItem(Item item, HttpServletRequest request) {

        User loggedInUser =
                (User) request.getAttribute("loggedInUser");

        item.setCreatedBy(loggedInUser.getName());

        item.setCreatedAt(LocalDateTime.now());

        return itemRepository.save(item);
    }

    @Override
    public List<Item> getAllItems(String productAvailability) {

        if (productAvailability == null || productAvailability.isBlank()) {
            return itemRepository.findAll(
                    Sort.by(Sort.Direction.DESC, "id")
            );
        }

        return itemRepository.findByProductAvailability(
                productAvailability,
                Sort.by(Sort.Direction.DESC, "id")
        );
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
    public Item updateItem(Long id,
                           Item item,
                           HttpServletRequest request){

        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

    User loggedInUser =
            (User) request.getAttribute("loggedInUser");

        existingItem.setItemName(item.getItemName());
        existingItem.setPrice(item.getPrice());
        existingItem.setQuantity(item.getQuantity());
        existingItem.setCategory(item.getCategory());
        existingItem.setBrand(item.getBrand());
        existingItem.setPurchaseDate(item.getPurchaseDate());
        existingItem.setProductCode(item.getProductCode());
        existingItem.setPaymentMethod(item.getPaymentMethod());
        existingItem.setProductAvailability(item.getProductAvailability());
        existingItem.setFiles(item.getFiles());

        existingItem.setSupplier(item.getSupplier());

        existingItem.setUpdatedBy(loggedInUser.getName());
        existingItem.setUpdatedAt(LocalDateTime.now());

        return itemRepository.save(existingItem);
    }

}