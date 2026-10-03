package com.archivalia.book.dto;

import jakarta.validation.constraints.NotBlank;

public class RequirementRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String note;

    public RequirementRequest() {
    }

    public RequirementRequest(String title, String note) {
        this.title = title;
        this.note = note;
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
}
