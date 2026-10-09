package com.archivalia.discovery.service;

import com.archivalia.discovery.dto.DiscoveredBookDto;
import com.archivalia.discovery.dto.ImportBookRequest;
import com.archivalia.discovery.entity.DiscoveryJob;
import com.archivalia.discovery.repository.DiscoveryJobRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScraperService {

    private static final Logger log = LoggerFactory.getLogger(ScraperService.class);

    private final DiscoveryJobRepository jobRepository;
    private final RestClient restClient;

    private static final List<String> SWATCH_PALETTES = List.of(
            "from-sky-500 to-blue-900",
            "from-indigo-500 to-slate-900",
            "from-emerald-500 to-teal-900",
            "from-amber-500 to-orange-900",
            "from-rose-500 to-red-950",
            "from-violet-500 to-purple-950",
            "from-cyan-500 to-teal-900",
            "from-fuchsia-500 to-pink-900"
    );

    // Curated academic repository seed catalog
    private static final List<DiscoveredBookDto> CURATED_ACADEMIC_STORE = List.of(
            new DiscoveredBookDto(
                    "Designing Data-Intensive Applications",
                    "Martin Kleppmann",
                    2017,
                    "The definitive guide to the architecture of storage engines, distributed consensus, stream processing, and data consistency models.",
                    "978-1449373320",
                    "ebooks",
                    "from-rose-500 to-red-950",
                    "OPEN_LIBRARY",
                    List.of("distributed-systems", "databases", "scalability", "consensus"),
                    "https://openlibrary.org/works/OL17855320W"
            ),
            new DiscoveredBookDto(
                    "Site Reliability Engineering: How Google Runs Production Systems",
                    "Betsy Beyer, Chris Jones, Jennifer Petoff",
                    2016,
                    "Key insights into Google's approach to the entire lifecycle of large-scale systems, service level objectives, and automated operations.",
                    "978-1491929124",
                    "ebooks",
                    "from-sky-500 to-blue-900",
                    "OPEN_LIBRARY",
                    List.of("cloud", "sre", "devops", "observability"),
                    "https://openlibrary.org/works/OL17377519W"
            ),
            new DiscoveredBookDto(
                    "Introduction to Algorithms (CLRS 4th Edition)",
                    "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
                    2022,
                    "Comprehensive textbook covering mathematical analysis of algorithms, graph theory, dynamic programming, and randomized methods.",
                    "978-0262046305",
                    "physical",
                    "from-indigo-500 to-slate-900",
                    "MIT_OPEN_COURSEWARE",
                    List.of("algorithms", "computer-science", "data-structures", "academic"),
                    "https://mitpress.mit.edu/9780262046305"
            ),
            new DiscoveredBookDto(
                    "Artificial Intelligence: A Modern Approach (4th Edition)",
                    "Stuart Russell, Peter Norvig",
                    2020,
                    "The authoritative reference text on rational agent architectures, probabilistic modeling, deep learning, and reinforcement learning.",
                    "978-0134610993",
                    "papers",
                    "from-emerald-500 to-teal-900",
                    "OPEN_LIBRARY",
                    List.of("ai", "machine-learning", "robotics", "probability"),
                    "https://aima.cs.berkeley.edu"
            ),
            new DiscoveredBookDto(
                    "Operating Systems: Three Easy Pieces",
                    "Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau",
                    2018,
                    "Explores the three fundamental pillars of modern systems programming: Virtualization, Concurrency, and Persistence.",
                    "978-1985086593",
                    "ebooks",
                    "from-amber-500 to-orange-900",
                    "OPEN_LIBRARY",
                    List.of("operating-systems", "concurrency", "memory", "virtualization"),
                    "https://pages.cs.wisc.edu/~remzi/OSTEP/"
            ),
            new DiscoveredBookDto(
                    "Computer Networking: A Top-Down Approach",
                    "James F. Kurose, Keith W. Ross",
                    2021,
                    "Principles and protocols of modern internetworking from the application layer down to the physical transport layer.",
                    "978-0136681557",
                    "physical",
                    "from-violet-500 to-purple-950",
                    "OPEN_LIBRARY",
                    List.of("networking", "tcp-ip", "security", "internet"),
                    "https://openlibrary.org/works/OL15357871W"
            )
    );

    public ScraperService(DiscoveryJobRepository jobRepository, RestClient restClient) {
        this.jobRepository = jobRepository;
        this.restClient = restClient;
    }

    /**
     * Search external academic/library catalogs via live Open Library API + curated store
     */
    public List<DiscoveredBookDto> search(String query, String source) {
        String cleanQuery = (query != null) ? query.trim() : "";
        List<DiscoveredBookDto> results = new ArrayList<>();

        // 1. Try Live Open Library Search API
        if (!cleanQuery.isEmpty()) {
            try {
                String url = "https://openlibrary.org/search.json?q=" + URLEncoder.encode(cleanQuery, StandardCharsets.UTF_8) + "&limit=8";
                Map<String, Object> response = restClient.get()
                        .uri(url)
                        .retrieve()
                        .body(new ParameterizedTypeReference<>() {});

                if (response != null && response.containsKey("docs")) {
                    List<?> docs = (List<?>) response.get("docs");
                    int idx = 0;
                    for (Object docObj : docs) {
                        if (docObj instanceof Map<?, ?> doc) {
                            String title = (String) doc.get("title");
                            if (title == null || title.isBlank()) continue;

                            String author = "Unknown Author";
                            if (doc.get("author_name") instanceof List<?> authors && !authors.isEmpty()) {
                                author = String.valueOf(authors.get(0));
                            }

                            Integer year = null;
                            if (doc.get("first_publish_year") instanceof Number numYear) {
                                year = numYear.intValue();
                            }

                            String isbn = null;
                            if (doc.get("isbn") instanceof List<?> isbns && !isbns.isEmpty()) {
                                isbn = String.valueOf(isbns.get(0));
                            }

                            List<String> tags = new ArrayList<>();
                            if (doc.get("subject") instanceof List<?> subjects) {
                                tags = subjects.stream()
                                        .limit(4)
                                        .map(String::valueOf)
                                        .collect(Collectors.toList());
                            }

                            String swatch = SWATCH_PALETTES.get(idx % SWATCH_PALETTES.size());
                            idx++;

                            String category = inferCategory(tags, title);

                            results.add(new DiscoveredBookDto(
                                    title,
                                    author,
                                    year != null ? year : 2023,
                                    "Open Academic Library discovery entry for " + title + " by " + author + ".",
                                    isbn,
                                    category,
                                    swatch,
                                    "OPEN_LIBRARY",
                                    tags,
                                    "https://openlibrary.org"
                            ));
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Open Library live search failed or timed out ({}). Using curated academic catalog.", e.getMessage());
            }
        }

        // 2. Supplement or fallback with curated academic store
        List<DiscoveredBookDto> filteredCurated = CURATED_ACADEMIC_STORE.stream()
                .filter(b -> cleanQuery.isEmpty() ||
                        b.getTitle().toLowerCase().contains(cleanQuery.toLowerCase()) ||
                        b.getAuthor().toLowerCase().contains(cleanQuery.toLowerCase()) ||
                        b.getTags().stream().anyMatch(t -> t.toLowerCase().contains(cleanQuery.toLowerCase())))
                .toList();

        results.addAll(filteredCurated);

        if (results.isEmpty()) {
            return CURATED_ACADEMIC_STORE;
        }

        // De-duplicate by title
        Map<String, DiscoveredBookDto> deduped = new LinkedHashMap<>();
        for (DiscoveredBookDto item : results) {
            deduped.putIfAbsent(item.getTitle().toLowerCase(), item);
        }

        return new ArrayList<>(deduped.values());
    }

    /**
     * Web scraper using JSoup: Extracts open graph and HTML metadata from a web page
     */
    public DiscoveredBookDto scrapeWebPage(String targetUrl) {
        if (targetUrl == null || targetUrl.isBlank()) {
            throw new IllegalArgumentException("Target URL cannot be empty");
        }

        String url = targetUrl.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }

        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ArchivaliaE-Library/1.0")
                    .referrer("https://www.google.com")
                    .timeout(8000)
                    .followRedirects(true)
                    .get();

            // Extract Title
            String title = doc.title();
            Element ogTitle = doc.selectFirst("meta[property=og:title], meta[name=twitter:title]");
            if (ogTitle != null && !ogTitle.attr("content").isBlank()) {
                title = ogTitle.attr("content");
            }
            if ((title == null || title.isBlank()) && doc.selectFirst("h1") != null) {
                title = doc.selectFirst("h1").text();
            }
            if (title == null || title.isBlank()) {
                title = "Web Resource: " + url;
            }

            // Extract Author
            String author = "Web Resource";
            Element metaAuthor = doc.selectFirst("meta[name=author], meta[property=article:author], meta[name=twitter:creator]");
            if (metaAuthor != null && !metaAuthor.attr("content").isBlank()) {
                author = metaAuthor.attr("content");
            }

            // Extract Description
            String description = "Discovered web reference from " + url;
            Element metaDesc = doc.selectFirst("meta[name=description], meta[property=og:description], meta[name=twitter:description]");
            if (metaDesc != null && !metaDesc.attr("content").isBlank()) {
                description = metaDesc.attr("content");
            }

            // Extract Tags/Keywords
            List<String> tags = new ArrayList<>(List.of("scraped", "web-resource"));
            Element metaKeywords = doc.selectFirst("meta[name=keywords]");
            if (metaKeywords != null && !metaKeywords.attr("content").isBlank()) {
                String[] kwList = metaKeywords.attr("content").split(",");
                for (String kw : kwList) {
                    String cleanKw = kw.trim().toLowerCase().replaceAll("[^a-z0-9-]", "");
                    if (!cleanKw.isBlank() && !tags.contains(cleanKw) && tags.size() < 5) {
                        tags.add(cleanKw);
                    }
                }
            }

            String swatch = SWATCH_PALETTES.get(Math.abs(title.hashCode()) % SWATCH_PALETTES.size());

            return new DiscoveredBookDto(
                    title,
                    author,
                    2024,
                    description,
                    null,
                    "papers",
                    swatch,
                    "JSOUP_SCRAPER",
                    tags,
                    url
            );

        } catch (Exception e) {
            log.error("Failed to scrape target URL {}: {}", url, e.getMessage());
            // Derive a clean fallback title from the URL path
            String fallbackTitle = url.replaceAll("^https?://", "").replaceAll("/$", "");
            return new DiscoveredBookDto(
                    fallbackTitle,
                    "Online Publication",
                    2024,
                    "Online academic resource discovered from " + url,
                    null,
                    "papers",
                    "from-cyan-500 to-teal-900",
                    "JSOUP_SCRAPER",
                    List.of("scraped", "reference", "academic"),
                    url
            );
        }
    }

    /**
     * One-click catalog ingestion: Sends title payload to Book Service (:8082) and logs DiscoveryJob
     */
    public DiscoveryJob importToCatalog(ImportBookRequest req) {
        String jobCode = "JOB-" + System.currentTimeMillis();
        String title = (req.getTitle() != null && !req.getTitle().isBlank()) ? req.getTitle().trim() : "Untitled Discovery";
        String author = (req.getAuthor() != null && !req.getAuthor().isBlank()) ? req.getAuthor().trim() : "Unknown Author";
        int year = (req.getYear() != null && req.getYear() > 0) ? req.getYear() : 2024;
        String category = (req.getCategory() != null && !req.getCategory().isBlank()) ? req.getCategory().toLowerCase() : "ebooks";
        String swatch = (req.getSwatch() != null && !req.getSwatch().isBlank()) ? req.getSwatch() : "from-indigo-500 to-slate-900";
        String description = (req.getDescription() != null && !req.getDescription().isBlank()) ? req.getDescription() : "Imported via Archivalia Discovery Service.";

        List<String> groups = (req.getGroups() != null && !req.getGroups().isEmpty())
                ? req.getGroups()
                : List.of(category, "saved", "research");

        String copyCode = "IMP-" + (System.currentTimeMillis() % 10000);
        String copyLocation = (req.getCopyLocation() != null) ? req.getCopyLocation() : "Digital Archive / Repository";

        Map<String, Object> copyPayload = Map.of(
                "copyCode", copyCode,
                "status", "AVAILABLE",
                "location", copyLocation
        );

        Map<String, Object> bookPayload = Map.of(
                "title", title,
                "author", author,
                "year", year,
                "rating", 5,
                "swatch", swatch,
                "groups", groups,
                "description", description,
                "copies", List.of(copyPayload)
        );

        String status = "SUCCESS";
        String details = "Successfully imported into catalog with 1 available copy (" + copyCode + ") at " + copyLocation;

        try {
            // Send to book-service directly at port 8082
            restClient.post()
                    .uri("http://localhost:8082/api/v1/books")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(bookPayload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Catalog import succeeded for title: {}", title);
        } catch (Exception e) {
            log.warn("Book-service call failed: {}. Logging job as PENDING.", e.getMessage());
            status = "PENDING";
            details = "Catalog ingestion queued (Book-service offline or response delayed: " + e.getMessage() + ")";
        }

        DiscoveryJob job = new DiscoveryJob(
                jobCode,
                title,
                "DISCOVERY_SERVICE",
                title,
                status,
                details
        );

        return jobRepository.save(job);
    }

    public List<DiscoveryJob> getJobHistory() {
        return jobRepository.findAllByOrderByImportedAtDesc();
    }

    private String inferCategory(List<String> tags, String title) {
        String combined = (title + " " + String.join(" ", tags)).toLowerCase();
        if (combined.contains("audio") || combined.contains("podcast") || combined.contains("speech")) {
            return "audio";
        }
        if (combined.contains("paper") || combined.contains("journal") || combined.contains("research") || combined.contains("thesis")) {
            return "papers";
        }
        if (combined.contains("video") || combined.contains("lecture") || combined.contains("course")) {
            return "videos";
        }
        if (combined.contains("physical") || combined.contains("hardcover") || combined.contains("monograph")) {
            return "physical";
        }
        return "ebooks";
    }
}
