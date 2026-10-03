package com.archivalia.book.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resource_requirements")
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String note;

    @Column(nullable = false)
    private String status = "OPEN"; // OPEN, FULFILLED

    public Requirement() {
    }

    public Requirement(String title, String note) {
        this.title = title;
        this.note = note;
        this.status = "OPEN";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
