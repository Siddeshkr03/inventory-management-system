package com.arraybots.formbackend.activity.repository;

import com.arraybots.formbackend.activity.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findTop5ByOrderByPerformedAtDesc();

}