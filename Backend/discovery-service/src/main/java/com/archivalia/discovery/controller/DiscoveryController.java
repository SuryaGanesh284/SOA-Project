package com.archivalia.discovery.controller;

import com.archivalia.discovery.dto.DiscoveredBookDto;
import com.archivalia.discovery.dto.ImportBookRequest;
import com.archivalia.discovery.entity.DiscoveryJob;
import com.archivalia.discovery.service.ScraperService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/discovery")
public class DiscoveryController {

    private final ScraperService scraperService;

    public DiscoveryController(ScraperService scraperService) {
        this.scraperService = scraperService;
    }

    /**
     * Search external open academic libraries and metadata sources
     */
    @GetMapping("/search")
    public ResponseEntity<List<DiscoveredBookDto>> searchGet(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "ALL") String source) {
        return ResponseEntity.ok(scraperService.search(q, source));
    }

    @PostMapping("/search")
    public ResponseEntity<List<DiscoveredBookDto>> searchPost(@RequestBody(required = false) Map<String, String> body) {
        String q = (body != null && body.containsKey("query")) ? body.get("query") : "";
        String source = (body != null && body.containsKey("source")) ? body.get("source") : "ALL";
        return ResponseEntity.ok(scraperService.search(q, source));
    }

    /**
     * Scrape metadata from any external web page URL using JSoup
     */
    @RequestMapping(value = "/scrape-url", method = {RequestMethod.POST, RequestMethod.GET})
    public ResponseEntity<DiscoveredBookDto> scrapeUrl(
            @RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String url) {
        String targetUrl = url;
        if (targetUrl == null || targetUrl.isBlank()) {
            if (body != null && body.containsKey("url")) {
                targetUrl = body.get("url");
            }
        }
        if (targetUrl == null || targetUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(scraperService.scrapeWebPage(targetUrl));
    }

    /**
     * One-click catalog ingestion: Imports discovered book into Book Service
     */
    @PostMapping("/import")
    public ResponseEntity<DiscoveryJob> importToCatalog(@RequestBody ImportBookRequest request) {
        DiscoveryJob job = scraperService.importToCatalog(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(job);
    }

    /**
     * Get discovery and scraping job history
     */
    @GetMapping("/jobs")
    public ResponseEntity<List<DiscoveryJob>> getJobs() {
        return ResponseEntity.ok(scraperService.getJobHistory());
    }
}
