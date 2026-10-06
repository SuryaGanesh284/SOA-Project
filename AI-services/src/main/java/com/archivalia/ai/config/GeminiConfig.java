package com.archivalia.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class GeminiConfig {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.5-flash}")
    private String model;

    @Value("${gemini.fallback-model:gemini-3.5-flash-lite}")
    private String fallbackModel;

    @Value("${gemini.base-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    @Value("${gemini.connect-timeout-ms:10000}")
    private int connectTimeoutMs;

    @Value("${gemini.read-timeout-ms:45000}")
    private int readTimeoutMs;

    @Bean
    public RestClient geminiRestClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectTimeoutMs);
        factory.setReadTimeout(readTimeoutMs);
        return RestClient.builder()
                .requestFactory(factory)
                .build();
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getModel() {
        return model;
    }

    public String getFallbackModel() {
        return fallbackModel;
    }

    public String getBaseUrl() {
        return baseUrl;
    }
}
