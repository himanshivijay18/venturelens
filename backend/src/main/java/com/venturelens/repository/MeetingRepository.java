package com.venturelens.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.venturelens.model.MeetingRequest;

public interface MeetingRepository extends JpaRepository<MeetingRequest, Long>{

}
