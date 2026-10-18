
package com.venturelens.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.venturelens.model.Investor;
import com.venturelens.repository.InvestorRepository;

@Service
public class InvestorService {

    @Autowired
    private InvestorRepository investorRepository;

    // Save investor
    public Investor saveInvestor(Investor investor) {
        return investorRepository.save(investor);
    }

    // Login investor
    public Investor loginInvestor(String email, String password) {

        Investor investor = investorRepository.findByEmail(email);

        if (investor != null
                && password != null
                && password.equals(investor.getPassword())) {
            return investor;
        }

        return null;
    }
}
