
package com.venturelens.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.venturelens.model.Startup;
import com.venturelens.repository.StartupRepository;

@Service
public class StartupService {

    @Autowired
    private StartupRepository startupRepository;

    public Startup saveStartup(Startup startup) {
        return startupRepository.save(startup);
    }


public Startup loginStartup(String email, String password) {
    Startup startup = startupRepository.findByEmail(email);

    if (startup != null && startup.getPassword().equals(password)) {
        return startup;
    }

    return null;
}




public Startup updateStartup(Long id, Startup updatedStartup) {

    Startup startup = startupRepository.findById(id).orElse(null);

    if (startup == null) {
        return null;
    }

    startup.setFounderName(updatedStartup.getFounderName());
    startup.setCompanyName(updatedStartup.getCompanyName());
    startup.setFundingStage(updatedStartup.getFundingStage());
    startup.setCategory(updatedStartup.getCategory());
    startup.setTargetMoney(updatedStartup.getTargetMoney());
    startup.setYearlyRevenue(updatedStartup.getYearlyRevenue());
    startup.setMonthlyExpenses(updatedStartup.getMonthlyExpenses());

    return startupRepository.save(startup);
}


}
