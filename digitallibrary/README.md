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
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Local file system

## Requirements

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

## Installation

### 1. Clone the repository and navigate to the project directory

```
git clone <repository-url>
cd Offline-Digital-Library-Desa-Wiyata-Tech
git checkout js
```

### 2. Install server dependencies

```
cd digitallibrary/server
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `server` directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/digitalLibrary
JWT_SECRET=your_secret_key_here
UPLOAD_DIR=uploads
```

### 4. Install client dependencies

```
cd ../client
npm install
```

## Running the Application

### 1. Start MongoDB service

Make sure MongoDB is running on your machine.

### 2. Start the server

```
cd ../server
npm run dev
```

### 3. Start the client

```
cd ../client
npm start
```

The application should now be running at `http://localhost:3000`

## Accessing the Library from Other Devices

Once the server is running, other devices on the same network can access the library by:

1. Finding the IP address of the server machine
2. Accessing `http://<server-ip>:5000` from any browser

## Admin Account

To create an admin account, register a new user, then update the user role in the database:

```javascript
// In MongoDB shell or using a tool like MongoDB Compass
db.users.updateOne({ username: "admin_username" }, { $set: { role: "admin" } })
```

## License

This project is licensed under the MIT License. 