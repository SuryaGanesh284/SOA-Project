package com.archivalia.book.controller;

import com.archivalia.book.dto.RequirementRequest;
import com.archivalia.book.entity.Requirement;
import com.archivalia.book.repository.RequirementRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping({"/api/v1/admin/inventory/requirements", "/api/v1/requirements"})
public class RequirementController {

    private final RequirementRepository requirementRepository;

    public RequirementController(RequirementRepository requirementRepository) {
        this.requirementRepository = requirementRepository;
    }

    @GetMapping
    public ResponseEntity<List<Requirement>> getRequirements() {
        return ResponseEntity.ok(requirementRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Requirement> addRequirement(@Valid @RequestBody RequirementRequest request) {
        Requirement requirement = new Requirement(request.getTitle(), request.getNote());
        Requirement saved = requirementRepository.save(requirement);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/fulfill")
    public ResponseEntity<Requirement> fulfillRequirement(@PathVariable("id") Long id) {
        Requirement requirement = requirementRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Requirement not found with id: " + id));
        requirement.setStatus("FULFILLED");
        Requirement saved = requirementRepository.save(requirement);
        return ResponseEntity.ok(saved);
    }
}
