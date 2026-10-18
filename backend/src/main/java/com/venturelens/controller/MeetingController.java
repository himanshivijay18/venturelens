package com.venturelens.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.venturelens.model.MeetingRequest;
import com.venturelens.service.MeetingService;

@RestController
@RequestMapping("/meeting")
@CrossOrigin(origins = "http://localhost:5173")
public class MeetingController {

	@Autowired
	private MeetingService meetingService;
	@PostMapping("/create")
	public MeetingRequest createMeeting(@RequestBody MeetingRequest meeting) {
		return meetingService.saveMeeting(meeting);
	}
}
