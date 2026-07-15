package com.arraybots.formbackend.items.repository;

import com.arraybots.formbackend.items.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import com.arraybots.formbackend.dashboard.dto.CategorySummaryDTO;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemRepository
        extends JpaRepository<Item, Long> {
    long countByProductAvailability(String productAvailability);

    List<Item> findByProductAvailability(
            String productAvailability,
            Sort sort
    );

    @Query("""
       SELECT new com.arraybots.formbackend.dashboard.dto.CategorySummaryDTO(
           i.category.categoryName,
           COUNT(i)
       )
       FROM Item i
       GROUP BY i.category.categoryName
       ORDER BY COUNT(i) DESC
       """)

    List<CategorySummaryDTO> getCategorySummary();

    List<Item> findTop5ByOrderByCreatedAtDesc();

}