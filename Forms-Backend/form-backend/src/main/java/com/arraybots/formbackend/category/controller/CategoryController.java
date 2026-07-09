package com.arraybots.formbackend.category.controller;

import com.arraybots.formbackend.category.model.Category;
import com.arraybots.formbackend.category.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public Category saveCategory(
            @RequestBody Category category,
            HttpServletRequest request) {

        return categoryService.saveCategory(category, request);

    }

    @GetMapping
    public List<Category> getAllCategories() {

        return categoryService.getAllCategories();

    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {

        return categoryService.getCategoryById(id);

    }

    @PutMapping("/{id}")
    public Category updateCategory(
            @PathVariable Long id,
            @RequestBody Category category,
            HttpServletRequest request) {

        return categoryService.updateCategory(id, category, request);

    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {

        categoryService.deleteCategory(id);

    }
}