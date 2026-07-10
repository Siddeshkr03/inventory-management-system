package com.arraybots.formbackend.supplier.service;

import com.arraybots.formbackend.supplier.model.Supplier;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface SupplierService {

    Supplier saveSupplier(Supplier supplier, HttpServletRequest request);

    List<Supplier> getAllSuppliers();

    Supplier getSupplierById(Long id);

    Supplier updateSupplier(Long id, Supplier supplier, HttpServletRequest request);

    void deleteSupplier(Long id);
}