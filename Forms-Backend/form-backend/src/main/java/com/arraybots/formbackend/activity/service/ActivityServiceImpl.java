package com.arraybots.formbackend.activity.service;

import com.arraybots.formbackend.activity.model.Activity;
import com.arraybots.formbackend.activity.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityServiceImpl(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @Override
    public void logActivity(
            String module,
            String action,
            String description,
            String performedBy) {

        Activity activity = new Activity();

        activity.setModule(module);
        activity.setAction(action);
        activity.setDescription(description);
        activity.setPerformedBy(performedBy);
        activity.setPerformedAt(LocalDateTime.now());

        activityRepository.save(activity);
    }

}