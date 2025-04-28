-- Create database if not exists
CREATE DATABASE IF NOT EXISTS digital_library;

-- Use the database
USE digital_library;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Books table
CREATE TABLE IF NOT EXISTS Books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  filePath VARCHAR(255) NOT NULL,
  coverImage VARCHAR(255),
  uploadedBy INT NOT NULL,
  uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  ISBN VARCHAR(50),
  pageCount INT,
  publisher VARCHAR(255),
  publicationYear INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploadedBy) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create admin user (password will be hashed by application on first login)
-- INSERT INTO Users (username, email, password, role) 
-- VALUES ('admin', 'admin@example.com', 'temporary_password_to_change', 'admin');

-- Note: Don't run the above INSERT statement directly
-- It's better to register through the application and then update the role:
-- UPDATE Users SET role = 'admin' WHERE username = 'your_admin_username'; 