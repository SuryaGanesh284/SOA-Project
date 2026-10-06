package com.archivalia.ai.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public class SemanticSearchRequest {

    @NotBlank(message = "Search query must not be blank")
    private String query;

    private Integer limit;

    private List<Map<String, Object>> catalogContext;

    public SemanticSearchRequest() {}

    public SemanticSearchRequest(String query, Integer limit, List<Map<String, Object>> catalogContext) {
        this.query = query;
        this.limit = limit;
        this.catalogContext = catalogContext;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public Integer getLimit() {
        return limit != null && limit > 0 ? limit : 5;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public List<Map<String, Object>> getCatalogContext() {
        return catalogContext;
    }

    public void setCatalogContext(List<Map<String, Object>> catalogContext) {
        this.catalogContext = catalogContext;
    }
}
