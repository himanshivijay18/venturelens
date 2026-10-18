
package com.venturelens.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.venturelens.model.Investor;

public interface InvestorRepository
        extends JpaRepository<Investor, Long> {

    Investor findByEmail(String email);
}
