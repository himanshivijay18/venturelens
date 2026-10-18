package com.venturelens.repository;
import com.venturelens.model.Startup;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StartupRepository extends JpaRepository<Startup, Long> {
	Startup findByEmail(String email);
}
