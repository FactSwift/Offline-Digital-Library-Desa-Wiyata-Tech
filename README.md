# Offline Digital Library

A JavaScript-based offline digital library application with local server capabilities.

## Features

- Browse, search, and filter books by title, author, and category
- View book details and metadata
- Read PDF books directly in the browser
- User authentication and authorization
- Admin panel for managing books and users
- Responsive design for access from multiple devices (PC, laptop, mobile)

## Technical Stack

- **Backend**: Node.js with Express
- **Frontend**: React with Bootstrap
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Local file system

## Requirements

- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

## Installation

### 1. Clone the repository and navigate to the project directory

```bash
git clone <repository-url>
cd Offline-Digital-Library-Desa-Wiyata-Tech
git checkout js
```

### 2. Create MySQL Database

```sql
CREATE DATABASE digital_library;
```

### 3. Install server dependencies

```bash
cd digitallibrary/server
npm install
```
### 4. open server/config/config.js
# Server Configuration
PORT=5001
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3307
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=digital_library

# Security
JWT_SECRET=your_secret_key_here  # Generate a strong random string
JWT_EXPIRES_IN=24h

# File Storage
UPLOAD_DIR=uploads
ALLOWED_FILE_TYPES=pdf,doc,docx
```

⚠️ **Security Notes:**
- Never commit the `config.js` file to version control
- Use strong, unique passwords for your database
- Generate a strong random string for JWT_SECRET (you can use a password generator)
- Keep your database credentials secure
- Regularly update dependencies to patch security vulnerabilities

### 5. Install client dependencies

```bash
cd ../client
npm install
```

## Running the Application

### 1. Start the server

```bash
cd ../server
npm run dev
```

### 2. Start the client

```bash
cd ../client
npm start
```

The application should now be running at `http://localhost:3000`

## Accessing the Library from Other Devices

Once the server is running, other devices on the same network can access the library by:

1. Finding the IP address of the server machine
2. Accessing `http://<server-ip>:3000` from any browser

## Admin Account

To create an admin account, register a new user, then update the user role in the database:

```sql
-- Using MySQL command line or a tool like MySQL Workbench
UPDATE Users SET role = 'admin' WHERE username = 'admin_username';
```

## Security Best Practices

1. **Database Security:**
   - Use strong passwords
   - Create a dedicated database user with minimal required privileges
   - Regularly backup your database
   - Keep MySQL updated to the latest version

2. **Application Security:**
   - Keep all dependencies updated
   - Use HTTPS in production
   - Implement rate limiting for API endpoints
   - Validate and sanitize all user inputs
   - Set secure cookie options
   - Implement proper CORS policies

3. **File Upload Security:**
   - Validate file types and sizes
   - Scan uploaded files for malware
   - Store files outside the web root
   - Use secure file naming conventions

## License

Apache License 
Version 2.0
