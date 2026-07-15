package com.arraybots.formbackend.dashboard.service;

import com.arraybots.formbackend.dashboard.dto.RecentItemResponse;
import com.arraybots.formbackend.items.model.Item;
import com.arraybots.formbackend.items.repository.ItemRepository;
import com.arraybots.formbackend.supplier.repository.SupplierRepository;
import com.arraybots.formbackend.dashboard.dto.DashboardDTO;
import org.springframework.stereotype.Service;
import com.arraybots.formbackend.dashboard.dto.CategorySummaryDTO;

import java.util.ArrayList;
import java.util.List;

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
                itemRepository.countByProductAvailability("IN_STOCK")
        );

        dashboardDTO.setLowStock(
                itemRepository.countByProductAvailability("LOW_STOCK")
        );

        dashboardDTO.setPreOrder(
                itemRepository.countByProductAvailability("PRE_ORDER")
        );

        dashboardDTO.setOutOfStock(
                itemRepository.countByProductAvailability("OUT_OF_STOCK")
        );
        
        return dashboardDTO;
    }

    @Override
    public List<CategorySummaryDTO> getCategorySummary() {
        return itemRepository.getCategorySummary();
    }

    @Override
    public List<RecentItemResponse> getRecentlyAddedItems() {

        List<Item> items = itemRepository.findTop5ByOrderByCreatedAtDesc();

        List<RecentItemResponse> response = new ArrayList<>();

        for (Item item : items) {

            RecentItemResponse dto = new RecentItemResponse();

            dto.setId(item.getId());
            dto.setItemName(item.getItemName());
            dto.setCategoryName(item.getCategory().getCategoryName());
            dto.setSupplierName(item.getSupplier().getSupplierName());
            dto.setCreatedAt(item.getCreatedAt());

            response.add(dto);
        }

        return response;
    }
}