package com.venturelens.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
@Entity
@Table(name = "startups")
@NoArgsConstructor
@AllArgsConstructor
public class Startup {

    
	@Override
	public String toString() {
	    return "Startup [id=" + id
	            + ", founderName=" + founderName
	            + ", email=" + email
	            + ", companyName=" + companyName
	            + ", fundingStage=" + fundingStage
	            + ", category=" + category
	            + ", targetMoney=" + targetMoney
	            + ", yearlyRevenue=" + yearlyRevenue
	            + ", monthlyExpenses=" + monthlyExpenses
	            + ", aiScore=" + aiScore
	            + ", riskLevel=" + riskLevel + "]";
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getFounderName() {
		return founderName;
	}
	public void setFounderName(String founderName) {
		this.founderName = founderName;
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
	public String getFundingStage() {
	    return fundingStage;
	}

	public void setFundingStage(String fundingStage) {
	    this.fundingStage = fundingStage;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getTargetMoney() {
		return targetMoney;
	}
	public void setTargetMoney(String targetMoney) {
		this.targetMoney = targetMoney;
	}
	public String getYearlyRevenue() {
		return yearlyRevenue;
	}
	public void setYearlyRevenue(String yearlyRevenue) {
		this.yearlyRevenue = yearlyRevenue;
	}
	public String getMonthlyExpenses() {
		return monthlyExpenses;
	}
	public void setMonthlyExpenses(String monthlyExpenses) {
		this.monthlyExpenses = monthlyExpenses;
	}
	public Integer getAiScore() {
		return aiScore;
	}
	public void setAiScore(Integer aiScore) {
		this.aiScore = aiScore;
	}
	public String getRiskLevel() {
		return riskLevel;
	}
	public void setRiskLevel(String riskLevel) {
		this.riskLevel = riskLevel;
	}
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String founderName;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String companyName;
    private String fundingStage;
    private String category;
    private String targetMoney;
    private String yearlyRevenue;
    private String monthlyExpenses;
    private Integer aiScore = 80;
    private String riskLevel = "Low Risk";
}