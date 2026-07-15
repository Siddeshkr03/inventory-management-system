package com.arraybots.formbackend.dashboard.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class RecentItemResponse {

    private Long id;
    private String itemName;
    private String categoryName;
    private String supplierName;
    private LocalDateTime createdAt;

    public RecentItemResponse() {
    }

    public RecentItemResponse(Long id, String itemName, String categoryName,
                              String supplierName, LocalDateTime createdAt) {
        this.id = id;
        this.itemName = itemName;
        this.categoryName = categoryName;
        this.supplierName = supplierName;
        this.createdAt = createdAt;
    }
}