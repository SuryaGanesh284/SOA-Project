package com.archivalia.discovery.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "discovery_jobs")
public class DiscoveryJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_code", nullable = false, unique = true, length = 64)
    private String jobCode;

    @Column(name = "search_query", length = 255)
    private String searchQuery;

    @Column(name = "source", length = 100)
    private String source;

    @Column(name = "target_title", nullable = false, length = 255)
    private String targetTitle;

    @Column(name = "status", nullable = false, length = 50)
    private String status; // SUCCESS, PENDING, FAILED

    @Column(name = "details", length = 1000)
    private String details;

    @Column(name = "imported_at")
    private LocalDateTime importedAt;

    public DiscoveryJob() {}

    public DiscoveryJob(String jobCode, String searchQuery, String source, String targetTitle, String status, String details) {
        this.jobCode = jobCode;
        this.searchQuery = searchQuery;
        this.source = source;
        this.targetTitle = targetTitle;
        this.status = status;
        this.details = details;
        this.importedAt = LocalDateTime.now();
    }

    @PrePersist
    public void onCreate() {
        if (this.importedAt == null) {
            this.importedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobCode() {
        return jobCode;
    }

    public void setJobCode(String jobCode) {
        this.jobCode = jobCode;
    }

    public String getSearchQuery() {
        return searchQuery;
    }

    public void setSearchQuery(String searchQuery) {
        this.searchQuery = searchQuery;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTargetTitle() {
        return targetTitle;
    }

    public void setTargetTitle(String targetTitle) {
        this.targetTitle = targetTitle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getImportedAt() {
        return importedAt;
    }

    public void setImportedAt(LocalDateTime importedAt) {
        this.importedAt = importedAt;
    }
}
