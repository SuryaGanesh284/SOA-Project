-- =============================================================================
-- Archivalia — MySQL Database Initialization
-- =============================================================================
-- This script runs automatically on first MySQL container start.
-- It creates all databases required by the microservices and grants
-- the application user full access to each.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS archivalia_auth_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS archivalia_book_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS archivalia_borrow_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS archivalia_fine_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS archivalia_notification_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS archivalia_recommendation_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

-- Grant the application user access to all service databases
-- The user is created automatically by MySQL Docker via MYSQL_USER env var
GRANT ALL PRIVILEGES ON archivalia_auth_db.* TO 'archivalia'@'%';
GRANT ALL PRIVILEGES ON archivalia_book_db.* TO 'archivalia'@'%';
GRANT ALL PRIVILEGES ON archivalia_borrow_db.* TO 'archivalia'@'%';
GRANT ALL PRIVILEGES ON archivalia_fine_db.* TO 'archivalia'@'%';
GRANT ALL PRIVILEGES ON archivalia_notification_db.* TO 'archivalia'@'%';
GRANT ALL PRIVILEGES ON archivalia_recommendation_db.* TO 'archivalia'@'%';
FLUSH PRIVILEGES;
