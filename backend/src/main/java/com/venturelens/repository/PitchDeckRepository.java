
package com.venturelens.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.venturelens.model.PitchDeck;

public interface PitchDeckRepository extends JpaRepository<PitchDeck, Long> {
	List<PitchDeck> findByStartupId(Long startupId);
}