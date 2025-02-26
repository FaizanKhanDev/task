# Project Name

## Description
This project is a TypeScript-based Node.js application that uses Express.js as the backend framework. It integrates Prisma for database management, authentication via JWT, file uploads with Multer, real-time communication using Socket.io, and background task scheduling with Node-Cron.

## Features
- Authentication with JWT
- Database management using Prisma
- File uploads via Multer
- Real-time communication with Socket.io
- Task scheduling using Node-Cron
- Email notifications using Nodemailer

## Prerequisites
Before running this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [PostgreSQL](https://www.postgresql.org/) (or another compatible database)
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli)

## Installation

Clone the repository:
```bash
git clone <repository_url>
cd <project_directory>
```

Install dependencies:
```bash
npm install
```

Set up environment variables:
Create a `.env` file in the root directory and add your configuration settings. Example:
```ini
DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## Database Setup
Run the Prisma migrations:
```bash
npm run prisma:migrate
```
Generate Prisma client:
```bash
npm run prisma:generate
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the application using `nodemon` with `ts-node`.

### Build and Run
```bash
npm run build
node dist/index.js
```

## Testing
Run tests using Mocha and Chai:
```bash
npm run test
```

## Cron Jobs
The application includes a scheduled task that runs every day at 8:00 AM to send reminders for incomplete tasks. This is handled using `node-cron`.

## File Uploads
File uploads are managed using Multer. Ensure the `uploads/` directory exists or configure a storage solution.

## Real-time Features
Socket.io is used for real-time communication. Ensure your client-side application is correctly configured to connect to the WebSocket server.

## License
This project is licensed under the MIT License.

## Author
Faizan Khan