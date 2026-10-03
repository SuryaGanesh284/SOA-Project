package com.archivalia.borrow.client;

import com.archivalia.borrow.exception.BadRequestException;
import com.archivalia.borrow.exception.ConflictException;
import com.archivalia.borrow.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class BookServiceClient {

    private final RestTemplate restTemplate;

    public BookServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void reserveBook(Long bookId) {
        String url = "http://book-service/internal/books/" + bookId + "/reserve";
        try {
            restTemplate.postForEntity(url, null, Void.class);
        } catch (HttpClientErrorException e) {
            handleException(e);
        }
    }

    public void releaseBook(Long bookId) {
        String url = "http://book-service/internal/books/" + bookId + "/release";
        try {
            restTemplate.postForEntity(url, null, Void.class);
        } catch (HttpClientErrorException e) {
            handleException(e);
        }
    }

    private void handleException(HttpClientErrorException e) {
        if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
            throw new ResourceNotFoundException("Book not found or could not be verified.");
        }
        if (e.getStatusCode() == HttpStatus.CONFLICT) {
            throw new ConflictException("Book is not available for borrowing.");
        }
        if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
            throw new BadRequestException("Invalid request to book service.");
        }
        throw new RuntimeException("Error communicating with book service: " + e.getMessage());
    }
}
