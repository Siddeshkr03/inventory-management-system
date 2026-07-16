package com.arraybots.formbackend.supplier.controller;

import com.arraybots.formbackend.supplier.model.Supplier;
import com.arraybots.formbackend.supplier.service.SupplierService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    public Supplier saveSupplier(@RequestBody Supplier supplier,
                                 HttpServletRequest request) {

        return supplierService.saveSupplier(supplier, request);
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable Long id) {
        return supplierService.getSupplierById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id, HttpServletRequest request) {
        supplierService.deleteSupplier(id, request);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id,
                                   @RequestBody Supplier supplier,
                                   HttpServletRequest request) {

        return supplierService.updateSupplier(id, supplier, request);
    }
}