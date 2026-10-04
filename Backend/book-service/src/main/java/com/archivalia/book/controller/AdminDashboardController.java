package com.archivalia.book.controller;

import com.archivalia.book.dto.AdminDashboardDto;
import com.archivalia.book.entity.CopyStatus;
import com.archivalia.book.repository.BookCopyRepository;
import com.archivalia.book.repository.BookRepository;
import com.archivalia.book.repository.RequirementRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/admin/dashboard", "/api/v1/dashboard"})
public class AdminDashboardController {

    private static final Logger log = LoggerFactory.getLogger(AdminDashboardController.class);

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final RequirementRepository requirementRepository;
    private final RestClient restClient;

    public AdminDashboardController(
            BookRepository bookRepository,
            BookCopyRepository bookCopyRepository,
            RequirementRepository requirementRepository) {
        this.bookRepository = bookRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.requirementRepository = requirementRepository;
        this.restClient = RestClient.builder().build();
    }

    @GetMapping
    public ResponseEntity<AdminDashboardDto> getDashboardSummary() {
        long titles = bookRepository.count();
        long totalCopies = bookCopyRepository.count();
        long availableCopies = bookCopyRepository.countByStatus(CopyStatus.AVAILABLE);
        long borrowedCopies = bookCopyRepository.countByStatus(CopyStatus.BORROWED);
        long maintenanceCopies = bookCopyRepository.countByStatus(CopyStatus.MAINTENANCE);
        long openReqs = requirementRepository.countByStatus("OPEN");
        long fulfilledReqs = requirementRepository.countByStatus("FULFILLED");

        Map<String, String> servicesStatus = new HashMap<>();
        servicesStatus.put("eureka-server", "UP");
        servicesStatus.put("api-gateway", "UP");
        servicesStatus.put("book-service", "UP");

        long activeLoans = borrowedCopies;
        try {
            List<?> borrows = restClient.get()
                    .uri("http://localhost:8080/api/v1/borrows")
                    .retrieve()
                    .body(List.class);
            if (borrows != null) {
                servicesStatus.put("borrow-service", "UP");
                activeLoans = borrows.stream()
                        .filter(b -> b instanceof Map<?, ?> m && "ACTIVE".equals(m.get("status")))
                        .count();
            }
        } catch (Exception e) {
            log.warn("Could not query borrow-service: {}", e.getMessage());
            servicesStatus.put("borrow-service", "DEGRADED");
        }

        long totalUsers = 2;
        try {
            Map<?, ?> health = restClient.get()
                    .uri("http://localhost:8081/actuator/health")
                    .retrieve()
                    .body(Map.class);
            if (health != null && "UP".equals(health.get("status"))) {
                servicesStatus.put("auth-service", "UP");
            } else {
                servicesStatus.put("auth-service", "DEGRADED");
            }
        } catch (Exception e) {
            log.warn("Could not query auth-service: {}", e.getMessage());
            servicesStatus.put("auth-service", "DEGRADED");
        }

        long pendingFines = 0;
        int outstandingAmount = 0;
        long totalPaidFines = 0;
        int totalCollectedAmount = 0;
        try {
            List<?> fines = restClient.get()
                    .uri("http://localhost:8080/api/v1/fines")
                    .retrieve()
                    .body(List.class);
            if (fines != null) {
                servicesStatus.put("fine-service", "UP");
                for (Object item : fines) {
                    if (item instanceof Map<?, ?> m) {
                        String status = String.valueOf(m.get("status"));
                        Number amountNum = (Number) m.get("amount");
                        int amt = (amountNum != null) ? amountNum.intValue() : 0;
                        if ("PENDING".equals(status)) {
                            pendingFines++;
                            outstandingAmount += amt;
                        } else if ("PAID".equals(status)) {
                            totalPaidFines++;
                            totalCollectedAmount += amt;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not query fine-service: {}", e.getMessage());
            servicesStatus.put("fine-service", "DEGRADED");
        }

        AdminDashboardDto dto = new AdminDashboardDto(
                titles,
                totalCopies,
                availableCopies,
                borrowedCopies,
                maintenanceCopies,
                activeLoans,
                totalUsers,
                pendingFines,
                outstandingAmount,
                totalPaidFines,
                totalCollectedAmount,
                openReqs,
                fulfilledReqs,
                servicesStatus
        );

        return ResponseEntity.ok(dto);
    }
}
