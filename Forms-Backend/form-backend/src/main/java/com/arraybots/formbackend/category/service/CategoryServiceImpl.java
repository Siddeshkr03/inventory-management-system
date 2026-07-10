package com.arraybots.formbackend.category.service;

import com.arraybots.formbackend.category.model.Category;
import com.arraybots.formbackend.category.repository.CategoryRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import com.arraybots.formbackend.user.model.User;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category saveCategory(
            Category category,
            HttpServletRequest request){

        // Remove leading and trailing spaces
        category.setCategoryName(category.getCategoryName().trim());

        // Convert code to uppercase
        category.setCategoryCode(
                category.getCategoryCode()
                        .trim()
                        .toUpperCase()
        );

        // Check duplicate category name
        if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new RuntimeException("Category name already exists.");
        }

        // Check duplicate category code
        if (categoryRepository.existsByCategoryCode(category.getCategoryCode())) {
            throw new RuntimeException("Category code already exists.");
        }

        User loggedInUser =
                (User) request.getAttribute("loggedInUser");

        category.setCreatedBy(loggedInUser.getName());
        category.setCreatedAt(LocalDateTime.now());

        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {

        return categoryRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

    }

    @Override
    public Category getCategoryById(Long id) {

        return categoryRepository.findById(id).orElse(null);

    }

    @Override
    public Category updateCategory(
            Long id,
            Category category,
            HttpServletRequest request) {

        User loggedInUser =
                (User) request.getAttribute("loggedInUser");

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (categoryRepository.existsByCategoryNameAndIdNot(
                category.getCategoryName().trim(),
                id)) {

            throw new RuntimeException("Category name already exists.");
        }

        if (categoryRepository.existsByCategoryCodeAndIdNot(
                category.getCategoryCode().trim().toUpperCase(),
                id)) {

            throw new RuntimeException("Category code already exists.");
        }

        // Remove leading and trailing spaces
        existingCategory.setCategoryName(
                category.getCategoryName().trim()
        );

        // Convert code to uppercase
        existingCategory.setCategoryCode(
                category.getCategoryCode()
                        .trim()
                        .toUpperCase()
        );

        existingCategory.setDescription(category.getDescription());

        existingCategory.setUpdatedBy(loggedInUser.getName());
        existingCategory.setUpdatedAt(LocalDateTime.now());

        return categoryRepository.save(existingCategory);

    }

    @Override
    public void deleteCategory(Long id) {

        categoryRepository.deleteById(id);

    }
}