package com.arraybots.formbackend.dashboard.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardDTO {

    private Long totalItems;

    private Long totalSuppliers;

    private Long inStock;

    private Long lowStock;

    private Long preOrder;

    private Long outOfStock;

}