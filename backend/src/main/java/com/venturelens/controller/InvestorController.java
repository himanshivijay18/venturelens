
package com.venturelens.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.venturelens.model.Investor;
import com.venturelens.service.InvestorService;

@RestController
@RequestMapping("/investor")
@CrossOrigin(origins = "http://localhost:5173")
public class InvestorController {

    @Autowired
    private InvestorService investorService;

    // Register investor
    @PostMapping("/register")
    public ResponseEntity<?> registerInvestor(@RequestBody Investor investor) {
        Investor result = investorService.saveInvestor(investor);
        return ResponseEntity.ok(result);
    }

    // Login investor
    @PostMapping("/login")
    public ResponseEntity<?> loginInvestor(@RequestBody Investor investor) {

        System.out.println("Login API called: " + investor.getEmail());

        Investor result = investorService.loginInvestor(
                investor.getEmail(),
                investor.getPassword()
        );

        if (result == null) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        System.out.println("Login successful for: " + result.getEmail());

        return ResponseEntity.ok(result);
    }
}
