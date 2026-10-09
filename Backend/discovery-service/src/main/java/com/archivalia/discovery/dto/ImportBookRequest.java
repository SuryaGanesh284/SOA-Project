package com.archivalia.discovery.dto;

import java.util.List;

public class ImportBookRequest {
    private String title;
    private String author;
    private Integer year = 2024;
    private String category = "ebooks";
    private String description;
    private String swatch = "from-indigo-500 to-slate-900";
    private Integer copiesCount = 1;
    private String copyLocation = "Digital Archive / Shelf D1";
    private List<String> groups;

    public ImportBookRequest() {}

    public ImportBookRequest(String title, String author, Integer year, String category, String description, String swatch) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.category = category;
        this.description = description;
        this.swatch = swatch;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSwatch() {
        return swatch;
    }

    public void setSwatch(String swatch) {
        this.swatch = swatch;
    }

    public Integer getCopiesCount() {
        return copiesCount;
    }

    public void setCopiesCount(Integer copiesCount) {
        this.copiesCount = copiesCount;
    }

    public String getCopyLocation() {
        return copyLocation;
    }

    public void setCopyLocation(String copyLocation) {
        this.copyLocation = copyLocation;
    }

    public List<String> getGroups() {
        return groups;
    }

    public void setGroups(List<String> groups) {
        this.groups = groups;
    }
}
