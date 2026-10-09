package com.archivalia.borrow.config;

import com.archivalia.borrow.entity.Loan;
import com.archivalia.borrow.entity.LoanStatus;
import com.archivalia.borrow.repository.LoanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class BorrowDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(BorrowDataInitializer.class);

    private final LoanRepository loanRepository;

    public BorrowDataInitializer(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    @Override
    public void run(String... args) {
        if (loanRepository.count() == 0) {
            log.info("Pre-seeding initial library loans...");

            Loan l1 = new Loan(
                    "loan-1",
                    "USR-101",
                    "Ben Bradle",
                    "user@archivalia.test",
                    "PHY-014",
                    "The Design of Everyday Things",
                    LocalDate.now().minusDays(10),
                    LocalDate.now().plusDays(4)
            );
            l1.setStatus(LoanStatus.ACTIVE);

            Loan l2 = new Loan(
                    "loan-2",
                    "USR-101",
                    "Ben Bradle",
                    "user@archivalia.test",
                    "DIG-102",
                    "Clean Code",
                    LocalDate.now().minusDays(20),
                    LocalDate.now().minusDays(6)
            );
            l2.setReturnedAt(LocalDate.now().minusDays(6));
            l2.setStatus(LoanStatus.RETURNED);

            loanRepository.saveAll(Arrays.asList(l1, l2));
            log.info("Seeded {} initial loans into database.", loanRepository.count());
        }
    }
}
