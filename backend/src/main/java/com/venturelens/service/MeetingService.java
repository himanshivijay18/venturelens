package com.venturelens.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.venturelens.model.MeetingRequest;
import com.venturelens.repository.MeetingRepository;

@Service
public class MeetingService {

	 @Autowired
	    private MeetingRepository meetingRepository;

	    public MeetingRequest saveMeeting(MeetingRequest meeting) {
	        return meetingRepository.save(meeting);
	    }
}
