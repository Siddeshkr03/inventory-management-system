package com.arraybots.formbackend.items.repository;

import com.arraybots.formbackend.items.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository
        extends JpaRepository<Item, Long> {
    long countByProductAvailability(String productAvailability);
}