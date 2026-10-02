package com.archivalia.fine.controller;

import com.archivalia.fine.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhooks/razorpay")
public class WebhookController {

    private final FineService fineService;

    public WebhookController(FineService fineService) {
        this.fineService = fineService;
    }

    @PostMapping
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        fineService.processRazorpayWebhook(payload, signature);
        return ResponseEntity.ok("OK");
    }
}
