package com.archivalia.fine.config;

import com.archivalia.fine.entity.Fine;
import com.archivalia.fine.entity.FineStatus;
import com.archivalia.fine.repository.FineRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class FineDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(FineDataInitializer.class);

    private final FineRepository fineRepository;

    public FineDataInitializer(FineRepository fineRepository) {
        this.fineRepository = fineRepository;
    }

    @Override
    public void run(String... args) {
        if (fineRepository.count() == 0) {
            log.info("Pre-seeding starter fines into database...");

            Fine f1 = new Fine(
                    "fine-1",
                    2L,
                    "USR-101",
                    "Ben Bradle",
                    "user@archivalia.test",
                    "Clean Code",
                    40,
                    "Returned 2 days late",
                    LocalDate.now().minusDays(5)
            );
            f1.setStatus(FineStatus.PENDING);

            Fine f2 = new Fine(
                    "fine-2",
                    null,
                    "USR-101",
                    "Ben Bradle",
                    "user@archivalia.test",
                    "Atomic Habits",
                    20,
                    "Returned 1 day late",
                    LocalDate.now().minusDays(12)
            );
            f2.setStatus(FineStatus.PAID);
            f2.setPaidAt(LocalDate.now().minusDays(10));
            f2.setPaymentReference("pay_rzp_mock_102");
            f2.setPaymentMethod("RAZORPAY_SANDBOX");

            fineRepository.saveAll(Arrays.asList(f1, f2));
            log.info("Seeded {} starter fines.", fineRepository.count());
        }
    }
}
