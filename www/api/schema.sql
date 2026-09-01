-- Run this once against your Hostinger MySQL database (phpMyAdmin, in
-- hPanel under Databases -> phpMyAdmin -> select your DB -> SQL tab ->
-- paste this in and run it) before using registration/login.

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
