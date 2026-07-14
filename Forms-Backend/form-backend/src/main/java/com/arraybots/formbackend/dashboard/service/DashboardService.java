package com.arraybots.formbackend.dashboard.service;

import com.arraybots.formbackend.dashboard.dto.DashboardDTO;
import com.arraybots.formbackend.dashboard.dto.CategorySummaryDTO;

import java.util.List;
import java.util.Map;

public interface DashboardService {

    DashboardDTO getDashboardData();

    List<CategorySummaryDTO> getCategorySummary();

}