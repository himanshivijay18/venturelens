
package com.venturelens.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.venturelens.model.PitchDeck;
import com.venturelens.model.Startup;
import com.venturelens.repository.PitchDeckRepository;
import com.venturelens.repository.StartupRepository;

@Service
public class PitchDeckService {

    private final PitchDeckRepository pitchDeckRepository;
    private final StartupRepository startupRepository;

    private final Path uploadDirectory =
            Paths.get("uploads", "pitch-decks").toAbsolutePath().normalize();

    public PitchDeckService(PitchDeckRepository pitchDeckRepository,
                            StartupRepository startupRepository) {
        this.pitchDeckRepository = pitchDeckRepository;
        this.startupRepository = startupRepository;
    }

    public PitchDeck uploadPitchDeck(Long startupId, MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a PDF file.");
        }

        if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")
                || !"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are allowed.");
        }

        if (file.getSize() > 50L * 1024 * 1024) {
            throw new IllegalArgumentException("File size must not exceed 50 MB.");
        }

        byte[] fileBytes = file.getBytes();

        if (fileBytes.length < 5
                || fileBytes[0] != '%'
                || fileBytes[1] != 'P'
                || fileBytes[2] != 'D'
                || fileBytes[3] != 'F'
                || fileBytes[4] != '-') {
            throw new IllegalArgumentException("The uploaded file is not a valid PDF.");
        }

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new IllegalArgumentException("Startup not found."));

        Files.createDirectories(uploadDirectory);

        String originalName = Paths.get(file.getOriginalFilename())
                .getFileName().toString();

        String storedName = UUID.randomUUID() + ".pdf";
        Path destination = uploadDirectory.resolve(storedName).normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException("Invalid file name.");
        }

        Files.copy(file.getInputStream(), destination,
                StandardCopyOption.REPLACE_EXISTING);

        PitchDeck pitchDeck = new PitchDeck();
        pitchDeck.setFileName(originalName);
        pitchDeck.setFilePath(destination.toString());
        pitchDeck.setContentType("application/pdf");
        pitchDeck.setUploadDate(LocalDateTime.now());
        pitchDeck.setStartup(startup);

        try {
            return pitchDeckRepository.save(pitchDeck);
        } catch (RuntimeException e) {
            Files.deleteIfExists(destination);
            throw e;
        }
    }

   
    public List<PitchDeck> getPitchDecks(Long startupId) {
        if (!startupRepository.existsById(startupId)) {
            throw new IllegalArgumentException("Startup not found.");
        }

        return pitchDeckRepository.findByStartupId(startupId);
    }
    
}
