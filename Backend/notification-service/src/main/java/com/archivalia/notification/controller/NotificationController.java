package com.archivalia.notification.controller;

import com.archivalia.notification.dto.CreateNotificationRequest;
import com.archivalia.notification.dto.NotificationDto;
import com.archivalia.notification.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<NotificationDto>> getMyNotifications(
            @RequestParam(name = "userId", required = false) String userIdParam,
            @RequestHeader(name = "X-User-Id", required = false) String userIdHeader) {
        String userId = (userIdParam != null && !userIdParam.trim().isEmpty())
                ? userIdParam : ((userIdHeader != null && !userIdHeader.trim().isEmpty()) ? userIdHeader : "USR-101");
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getAllNotifications(
            @RequestParam(name = "userId", required = false) String userIdParam) {
        if (userIdParam != null && !userIdParam.trim().isEmpty()) {
            return ResponseEntity.ok(notificationService.getUserNotifications(userIdParam));
        }
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(
            @RequestParam(name = "userId", required = false) String userIdParam) {
        String userId = (userIdParam != null && !userIdParam.trim().isEmpty()) ? userIdParam : "USR-101";
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("userId", userId, "unreadCount", count));
    }

    @PostMapping
    public ResponseEntity<NotificationDto> createNotification(@Valid @RequestBody CreateNotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(request));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsReadPut(@PathVariable("id") String id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsReadPost(@PathVariable("id") String id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PutMapping("/read-all")
    public ResponseEntity<List<NotificationDto>> markAllAsReadPut(
            @RequestParam(name = "userId", required = false) String userId) {
        return ResponseEntity.ok(notificationService.markAllAsRead(userId));
    }

    @PostMapping("/read-all")
    public ResponseEntity<List<NotificationDto>> markAllAsReadPost(
            @RequestParam(name = "userId", required = false) String userId) {
        return ResponseEntity.ok(notificationService.markAllAsRead(userId));
    }
}
