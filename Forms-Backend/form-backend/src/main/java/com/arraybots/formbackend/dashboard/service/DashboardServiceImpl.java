package com.arraybots.formbackend.dashboard.service;

import com.arraybots.formbackend.items.repository.ItemRepository;
import com.arraybots.formbackend.supplier.repository.SupplierRepository;
import com.arraybots.formbackend.dashboard.dto.DashboardDTO;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ItemRepository itemRepository;

    private final SupplierRepository supplierRepository;

    public DashboardServiceImpl(ItemRepository itemRepository,
                                SupplierRepository supplierRepository) {

        this.itemRepository = itemRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    public DashboardDTO getDashboardData() {

        DashboardDTO dashboardDTO = new DashboardDTO();

        dashboardDTO.setTotalItems(itemRepository.count());

        dashboardDTO.setTotalSuppliers(supplierRepository.count());

        dashboardDTO.setInStock(
                itemRepository.countByProductAvailability("In Stock")
        );

        dashboardDTO.setLowStock(
                itemRepository.countByProductAvailability("Low Stock")
        );

        dashboardDTO.setPreOrder(
                itemRepository.countByProductAvailability("Pre-order")
        );

        dashboardDTO.setOutOfStock(
                itemRepository.countByProductAvailability("Out of Stock")
        );
        
        return dashboardDTO;
    }
}