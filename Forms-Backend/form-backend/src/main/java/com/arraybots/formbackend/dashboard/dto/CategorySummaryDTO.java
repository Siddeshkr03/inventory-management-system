package com.arraybots.formbackend.dashboard.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class CategorySummaryDTO {

    private String category;

    private Long count;

    public CategorySummaryDTO(String category, Long count) {
        this.category = category;
        this.count = count;
    }
}