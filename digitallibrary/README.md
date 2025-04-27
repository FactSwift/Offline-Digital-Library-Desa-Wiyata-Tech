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

```
git clone <repository-url>
cd Offline-Digital-Library-Desa-Wiyata-Tech
git checkout js
```

### 2. Create MySQL Database

```sql
CREATE DATABASE digital_library;
```

### 3. Install server dependencies

```
cd digitallibrary/server
npm install
```

### 4. Set up environment variables

Create a `.env` file in the `server` directory with the following content:

```
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=digital_library

# Security
JWT_SECRET=your_secret_key_here

# File Storage
UPLOAD_DIR=uploads
```

### 5. Install client dependencies

```
cd ../client
npm install
```

## Running the Application

### 1. Start the server

```
cd ../server
npm run dev
```

### 2. Start the client

```
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

## License

This project is licensed under the MIT License. 