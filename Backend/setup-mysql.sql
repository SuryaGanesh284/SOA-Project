-- ==========================================================
-- PS038: Archivalia E-Library System - MySQL Schemas Setup
-- Run this script inside MySQL Workbench
-- ==========================================================

-- 1. Create Microservice Databases
CREATE DATABASE IF NOT EXISTS elibrary_auth;
CREATE DATABASE IF NOT EXISTS elibrary_books;
CREATE DATABASE IF NOT EXISTS elibrary_borrows;
CREATE DATABASE IF NOT EXISTS elibrary_fines;
CREATE DATABASE IF NOT EXISTS elibrary_notifications;
CREATE DATABASE IF NOT EXISTS elibrary_recommendations;
CREATE DATABASE IF NOT EXISTS elibrary_discovery;

-- 2. Optional: Unified development database (if running all in one schema)
CREATE DATABASE IF NOT EXISTS elibrary_db;

-- 3. Verify Databases
SHOW DATABASES LIKE 'elibrary%';
