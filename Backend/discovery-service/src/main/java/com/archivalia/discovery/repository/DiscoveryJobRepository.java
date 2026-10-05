package com.archivalia.discovery.repository;

import com.archivalia.discovery.entity.DiscoveryJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscoveryJobRepository extends JpaRepository<DiscoveryJob, Long> {
    List<DiscoveryJob> findAllByOrderByImportedAtDesc();
}
