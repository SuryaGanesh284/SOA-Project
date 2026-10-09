package com.archivalia.notification.config;

import com.archivalia.notification.entity.Notification;
import com.archivalia.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class NotificationDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(NotificationDataInitializer.class);

    private final NotificationRepository notificationRepository;

    public NotificationDataInitializer(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) {
        if (notificationRepository.count() == 0) {
            log.info("Pre-seeding initial library notifications for USR-101 and ALL users...");

            notificationRepository.save(new Notification(
                    "notif-1",
                    "USR-101",
                    "Due soon",
                    "The Design of Everyday Things is due in 4 days.",
                    "LOAN_DUE",
                    false
            ));

            notificationRepository.save(new Notification(
                    "notif-2",
                    "USR-101",
                    "Return recorded",
                    "Clean Code was successfully returned to the circulation desk.",
                    "LOAN_RETURN",
                    false
            ));

            notificationRepository.save(new Notification(
                    "notif-3",
                    "USR-101",
                    "Payment",
                    "A fine payment is ready to confirm via Razorpay Sandbox.",
                    "FINE_PAYMENT",
                    true
            ));

            notificationRepository.save(new Notification(
                    "notif-4",
                    "ALL",
                    "Library Notice",
                    "System maintenance scheduled for tonight at 23:00 IST. Digital resources remain available.",
                    "SYSTEM",
                    false
            ));

            log.info("Pre-seeded 4 starter notifications in MySQL elibrary_notifications.");
        }
    }
}
