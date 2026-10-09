package com.archivalia.book.dto;

public class BookCopyDto {

    private String code;
    private String status;
    private String location;
    private String title;

    public BookCopyDto() {
    }

    public BookCopyDto(String code, String status, String location) {
        this.code = code;
        this.status = status;
        this.location = location;
    }

    public BookCopyDto(String code, String status, String location, String title) {
        this.code = code;
        this.status = status;
        this.location = location;
        this.title = title;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
