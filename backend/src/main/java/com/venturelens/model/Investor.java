
package com.venturelens.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "investors")
public class Investor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String investorName;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firmName;

    private String interestedCategory;

    // Default constructor required by JPA
    public Investor() {
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvestorName() {
        return investorName;
    }

    public void setInvestorName(String investorName) {
        this.investorName = investorName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirmName() {
        return firmName;
    }

    public void setFirmName(String firmName) {
        this.firmName = firmName;
    }

    public String getInterestedCategory() {
        return interestedCategory;
    }

    public void setInterestedCategory(String interestedCategory) {
        this.interestedCategory = interestedCategory;
    }

    @Override
    public String toString() {
        return "Investor{id=" + id
                + ", investorName='" + investorName + '\''
                + ", email='" + email + '\''
                + ", firmName='" + firmName + '\''
                + ", interestedCategory='" + interestedCategory + '\''
                + '}';
    }
}
