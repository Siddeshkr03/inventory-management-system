package com.arraybots.formbackend.dashboard.controller;

import com.arraybots.formbackend.dashboard.dto.CategorySummaryDTO;
import com.arraybots.formbackend.dashboard.dto.DashboardDTO;
import com.arraybots.formbackend.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardDTO getDashboardData() {
        return dashboardService.getDashboardData();
    }

    @GetMapping("/category-summary")
    public List<CategorySummaryDTO> getCategorySummary() {
        return dashboardService.getCategorySummary();
    }
}