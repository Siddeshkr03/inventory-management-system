package com.arraybots.formbackend.supplier.service;

import com.arraybots.formbackend.supplier.model.Supplier;

import java.util.List;

public interface SupplierService {

    Supplier saveSupplier(Supplier supplier);

    List<Supplier> getAllSuppliers();

    Supplier getSupplierById(Long id);

    Supplier updateSupplier(Long id, Supplier supplier);

    void deleteSupplier(Long id);
}