package com.archivalia.notification.service;

import com.archivalia.notification.dto.CreateNotificationRequest;
import com.archivalia.notification.dto.NotificationDto;
import com.archivalia.notification.entity.Notification;
import com.archivalia.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(String userId) {
        String target = (userId != null && !userId.trim().isEmpty()) ? userId.trim() : "USR-101";
        return notificationRepository.findByUserIdOrUserIdOrderByCreatedAtDesc(target, "ALL").stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String userId) {
        String target = (userId != null && !userId.trim().isEmpty()) ? userId.trim() : "USR-101";
        return notificationRepository.countByUserIdAndIsReadFalse(target);
    }

    public NotificationDto createNotification(CreateNotificationRequest request) {
        String code = "notif-" + System.currentTimeMillis();
        String target = (request.getUserId() != null && !request.getUserId().trim().isEmpty()) ? request.getUserId().trim() : "USR-101";
        Notification notification = new Notification(
                code,
                target,
                request.getTitle(),
                request.getMessage(),
                request.getType() != null ? request.getType() : "SYSTEM",
                false
        );
        Notification saved = notificationRepository.save(notification);
        log.info("Created notification {} for user {}: {}", code, target, saved.getTitle());
        return toDto(saved);
    }

    public NotificationDto markAsRead(String idOrCode) {
        Notification notification = findByIdOrCode(idOrCode);
        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notification = notificationRepository.save(notification);
            log.info("Notification {} marked as read", idOrCode);
        }
        return toDto(notification);
    }

    public List<NotificationDto> markAllAsRead(String userId) {
        String target = (userId != null && !userId.trim().isEmpty()) ? userId.trim() : "USR-101";
        List<Notification> list = notificationRepository.findByUserIdOrUserIdOrderByCreatedAtDesc(target, "ALL");
        for (Notification n : list) {
            if (!n.isRead()) {
                n.setRead(true);
                n.setReadAt(LocalDateTime.now());
            }
        }
        notificationRepository.saveAll(list);
        log.info("Marked all notifications read for user {}", target);
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    private Notification findByIdOrCode(String idOrCode) {
        if (idOrCode == null || idOrCode.trim().isEmpty()) {
            throw new NoSuchElementException("Notification id is required");
        }
        String trimmed = idOrCode.trim();
        try {
            Long numericId = Long.parseLong(trimmed);
            Optional<Notification> byId = notificationRepository.findById(numericId);
            if (byId.isPresent()) {
                return byId.get();
            }
        } catch (NumberFormatException ignored) {
        }
        return notificationRepository.findByNotificationCode(trimmed)
                .orElseThrow(() -> new NoSuchElementException("Notification not found with id: " + trimmed));
    }

    public NotificationDto toDto(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getNotificationCode(),
                n.getUserId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.isRead(),
                n.getCreatedAt() != null ? n.getCreatedAt().toString() : null,
                n.getReadAt() != null ? n.getReadAt().toString() : null
        );
    }
}
