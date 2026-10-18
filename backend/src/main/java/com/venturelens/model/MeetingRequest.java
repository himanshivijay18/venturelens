package com.venturelens.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "meeting_requests")
@NoArgsConstructor
@AllArgsConstructor
public class MeetingRequest {

    public MeetingRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public MeetingRequest(Long id, Investor investor, Startup startup, String message, String status) {
		super();
		this.id = id;
		this.investor = investor;
		this.startup = startup;
		this.message = message;
		this.status = status;
	}

	@Override
	public String toString() {
		return "MeetingRequest [id=" + id + ", investor=" + investor + ", startup=" + startup + ", message=" + message
				+ ", status=" + status + "]";
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Investor getInvestor() {
		return investor;
	}

	public void setInvestor(Investor investor) {
		this.investor = investor;
	}

	public Startup getStartup() {
		return startup;
	}

	public void setStartup(Startup startup) {
		this.startup = startup;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "investor_id", nullable = false)
    private Investor investor;

    @ManyToOne
    @JoinColumn(name = "startup_id", nullable = false)
    private Startup startup;

    @Column(length = 1000)
    private String message;

    private String status = "Pending";
}