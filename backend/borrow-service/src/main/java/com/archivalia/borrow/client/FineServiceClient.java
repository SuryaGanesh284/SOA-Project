package com.archivalia.borrow.client;

import com.archivalia.borrow.client.dto.FineCalculationRequest;
import com.archivalia.borrow.client.dto.FineCalculationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class FineServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(FineServiceClient.class);
    private final RestTemplate restTemplate;

    public FineServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void calculateFine(FineCalculationRequest request) {
        String url = "http://fine-service/internal/fines/calculate";
        try {
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            org.springframework.web.context.request.ServletRequestAttributes attributes = (org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                String authHeader = attributes.getRequest().getHeader("Authorization");
                if (authHeader != null) {
                    headers.set("Authorization", authHeader);
                }
            }
            
            HttpEntity<FineCalculationRequest> entity = new HttpEntity<>(request, headers);
            FineCalculationResponse response = restTemplate.postForObject(url, entity, FineCalculationResponse.class);
            if (response != null && response.getAmount() != null && response.getAmount().signum() > 0) {
                logger.info("Fine calculated successfully: Fine ID {}, Amount {}, Overdue Days {}",
                        response.getFineId(), response.getAmount(), response.getOverdueDays());
            } else {
                logger.info("No fine applicable for Borrow ID {}: {}", request.getBorrowId(), response != null ? response.getMessage() : "null response");
            }
        } catch (RestClientException e) {
            logger.error("Failed to call Fine Service for Borrow ID {}. The return was processed, but fine calculation may need to be retried manually. Error: {}", request.getBorrowId(), e.getMessage());
        }
    }
}
