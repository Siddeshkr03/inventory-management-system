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
    public List<Item> getAllItems(String productAvailability) {

        if (productAvailability == null || productAvailability.isBlank()) {
            return itemRepository.findAll();
        }

        return itemRepository.findByProductAvailability(productAvailability);
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

        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

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

        return itemRepository.save(existingItem);
    }

}