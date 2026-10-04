package com.archivalia.notification.repository;

import com.archivalia.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByOrderByCreatedAtDesc();

    List<Notification> findByUserIdOrUserIdOrderByCreatedAtDesc(String userId, String broadcastUserId);

    Optional<Notification> findByNotificationCode(String notificationCode);

    long countByUserIdAndIsReadFalse(String userId);
}
