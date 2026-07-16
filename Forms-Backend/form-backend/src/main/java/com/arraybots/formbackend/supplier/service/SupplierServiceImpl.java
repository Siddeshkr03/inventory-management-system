package com.arraybots.formbackend.supplier.service;

import com.arraybots.formbackend.activity.service.ActivityService;
import com.arraybots.formbackend.supplier.model.Supplier;
import com.arraybots.formbackend.supplier.repository.SupplierRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.arraybots.formbackend.user.model.User;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    private final ActivityService activityService;

    public SupplierServiceImpl(
            SupplierRepository supplierRepository,
            ActivityService activityService
    ) {
        this.supplierRepository = supplierRepository;
        this.activityService = activityService;
    }

    @Override
    public Supplier saveSupplier(Supplier supplier,
                                 HttpServletRequest request) {

        User loggedInUser =
                (User) request.getAttribute("loggedInUser");

        supplier.setCreatedBy(loggedInUser.getName());
        supplier.setCreatedAt(LocalDateTime.now());

        Supplier savedSupplier = supplierRepository.save(supplier);

        activityService.logActivity(
                "SUPPLIER",
                "CREATE",
                "Added supplier '" + savedSupplier.getSupplierName() + "'",
                loggedInUser.getName()
        );

        return savedSupplier;
    }

    @Override
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @Override
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteSupplier(Long id, HttpServletRequest request) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        User loggedInUser =
                (User) request.getAttribute("loggedInUser");

        String supplierName = supplier.getSupplierName();

        supplierRepository.delete(supplier);

        activityService.logActivity(
                "SUPPLIER",
                "DELETE",
                "Deleted supplier '" + supplierName + "'",
                loggedInUser.getName()
        );
    }

    @Override
    public Supplier updateSupplier(Long id,
                                   Supplier supplier,
                                   HttpServletRequest request) {

        User loggedInUser =
                (User) request.getAttribute("loggedInUser");

        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        existingSupplier.setSupplierName(supplier.getSupplierName());
        existingSupplier.setPhoneNumber(supplier.getPhoneNumber());
        existingSupplier.setEmail(supplier.getEmail());
        existingSupplier.setAddress(supplier.getAddress());

        existingSupplier.setUpdatedBy(loggedInUser.getName());
        existingSupplier.setUpdatedAt(LocalDateTime.now());

        Supplier updatedSupplier = supplierRepository.save(existingSupplier);

        activityService.logActivity(
                "SUPPLIER",
                "UPDATE",
                "Updated supplier '" + updatedSupplier.getSupplierName() + "'",
                loggedInUser.getName()
        );

        return updatedSupplier;
    }
}