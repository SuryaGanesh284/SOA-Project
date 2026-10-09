package com.archivalia.discovery.config;

import com.archivalia.discovery.entity.DiscoveryJob;
import com.archivalia.discovery.repository.DiscoveryJobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DiscoveryDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DiscoveryDataInitializer.class);

    private final DiscoveryJobRepository jobRepository;

    public DiscoveryDataInitializer(DiscoveryJobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public void run(String... args) {
        if (jobRepository.count() == 0) {
            log.info("Pre-seeding discovery job log history for Discovery Service...");

            List<DiscoveryJob> seedJobs = List.of(
                    new DiscoveryJob(
                            "JOB-17910001",
                            "Designing Data-Intensive Applications",
                            "OPEN_LIBRARY",
                            "Designing Data-Intensive Applications",
                            "SUCCESS",
                            "Initial system catalog bootstrap ingestion completed."
                    ),
                    new DiscoveryJob(
                            "JOB-17910002",
                            "Introduction to Algorithms",
                            "MIT_OPEN_COURSEWARE",
                            "Introduction to Algorithms (CLRS)",
                            "SUCCESS",
                            "Pre-cataloged physical reserve edition."
                    ),
                    new DiscoveryJob(
                            "JOB-17910003",
                            "Artificial Intelligence",
                            "OPEN_LIBRARY",
                            "Artificial Intelligence: A Modern Approach",
                            "SUCCESS",
                            "Curated digital research paper edition."
                    )
            );

            jobRepository.saveAll(seedJobs);
            log.info("Successfully seeded {} discovery job records.", seedJobs.size());
        }
    }
}
