-- PS038 Enterprise Academic E-Library System
-- Multi-database bootstrap for Docker Compose environment
CREATE DATABASE IF NOT EXISTS `elibrary_auth`;
CREATE DATABASE IF NOT EXISTS `elibrary_books`;
CREATE DATABASE IF NOT EXISTS `elibrary_borrows`;
CREATE DATABASE IF NOT EXISTS `elibrary_fines`;
CREATE DATABASE IF NOT EXISTS `elibrary_notifications`;
CREATE DATABASE IF NOT EXISTS `elibrary_recommendations`;
CREATE DATABASE IF NOT EXISTS `elibrary_discovery`;
