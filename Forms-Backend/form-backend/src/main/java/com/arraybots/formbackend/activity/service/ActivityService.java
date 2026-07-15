package com.arraybots.formbackend.activity.service;

public interface ActivityService {

    void logActivity(
            String module,
            String action,
            String description,
            String performedBy
    );

}