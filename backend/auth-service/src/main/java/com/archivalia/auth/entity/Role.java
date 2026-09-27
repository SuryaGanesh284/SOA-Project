package com.archivalia.auth.entity;

/**
 * Roles available in the Archivalia system.
 *
 * <p>Implementation decision: Using a Java enum mapped as a VARCHAR in the database
 * rather than a separate roles table. This keeps the model simple and type-safe
 * for the two known roles specified in the requirements. If roles need to become
 * dynamic or permission-based in a future phase, this can be migrated to a
 * many-to-many relationship with a roles table.</p>
 */
public enum Role {
    USER,
    ADMIN
}
