package com.arraybots.formbackend.activity.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class RecentActivityResponse {

    private Long id;
    private String module;
    private String action;
    private String description;
    private String performedBy;
    private LocalDateTime performedAt;

    public RecentActivityResponse() {
    }

}