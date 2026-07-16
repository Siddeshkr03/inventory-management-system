package com.arraybots.formbackend.category.service;

import com.arraybots.formbackend.category.model.Category;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

public interface CategoryService {

    List<Category> getAllCategories();

    Category saveCategory(
            Category category,
            HttpServletRequest request
    );

    Category getCategoryById(Long id);

    Category updateCategory(
            Long id,
            Category category,
            HttpServletRequest request
    );

    void deleteCategory(Long id, HttpServletRequest request);;
}