
package com.venturelens.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.venturelens.model.PitchDeck;
import com.venturelens.model.Startup;
import com.venturelens.service.PitchDeckService;
import com.venturelens.service.StartupService;

@RestController
@RequestMapping("/startup")
@CrossOrigin(origins = "http://localhost:5173")
public class StartupController {

    @Autowired
    private StartupService startupService;

    @Autowired
    private PitchDeckService pitchDeckService;

    @PostMapping("/register")
    public Startup registerStartup(@RequestBody Startup startup) {
        return startupService.saveStartup(startup);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginStartup(@RequestBody Startup startup) {

        Startup loggedInStartup = startupService.loginStartup(
                startup.getEmail(),
                startup.getPassword()
        );

        if (loggedInStartup == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok(loggedInStartup);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStartup(
            @PathVariable Long id,
            @RequestBody Startup updatedStartup) {

        Startup startup = startupService.updateStartup(id, updatedStartup);

        if (startup == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Startup not found");
        }

        return ResponseEntity.ok(startup);
    }

    @PostMapping("/{startupId}/pitch-decks")
    public ResponseEntity<?> uploadPitchDeck(
            @PathVariable Long startupId,
            @RequestParam("file") MultipartFile file) {

        try {
            PitchDeck deck = pitchDeckService.uploadPitchDeck(startupId, file);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Pitch deck uploaded successfully",
                            "id", deck.getId(),
                            "fileName", deck.getFileName(),
                            "contentType", deck.getContentType(),
                            "uploadDate", deck.getUploadDate()
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Unable to save the PDF file."));
        }
    }

    @GetMapping("/{startupId}/pitch-decks")
    public ResponseEntity<?> getPitchDecks(
            @PathVariable Long startupId) {

        try {
            List<Map<String, Object>> decks =
                    pitchDeckService.getPitchDecks(startupId)
                            .stream()
                            .map(deck -> Map.<String, Object>of(
                                    "id", deck.getId(),
                                    "fileName", deck.getFileName(),
                                    "contentType", deck.getContentType(),
                                    "uploadDate", deck.getUploadDate()
                            ))
                            .toList();

            return ResponseEntity.ok(decks);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
