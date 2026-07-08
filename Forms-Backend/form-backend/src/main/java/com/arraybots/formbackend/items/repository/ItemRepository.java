package com.arraybots.formbackend.items.repository;

import com.arraybots.formbackend.items.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface ItemRepository
        extends JpaRepository<Item, Long> {
    long countByProductAvailability(String productAvailability);

    List<Item> findByProductAvailability(
            String productAvailability,
            Sort sort
    );
}