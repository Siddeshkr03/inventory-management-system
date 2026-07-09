package com.arraybots.formbackend.category.repository;

import com.arraybots.formbackend.category.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    boolean existsByCategoryName(String categoryName);

    boolean existsByCategoryCode(String categoryCode);

    boolean existsByCategoryNameAndIdNot(
            String categoryName,
            Long id
    );

    boolean existsByCategoryCodeAndIdNot(
            String categoryCode,
            Long id
    );

}