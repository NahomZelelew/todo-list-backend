# DOM To-Do List - Backend Version

A simple To-Do List project built with HTML, CSS, JavaScript, Node.js, Express.js and MySQL (XAMPP).

## Features

- Add new tasks
- Delete tasks
- Mark tasks as completed
- Press Enter to add a task
- Store tasks in MySQL
- Load saved tasks when the page opens
- Update completion status in the database

## Technologies Used

- HTML
- CSS
- JavaScript / DOM
- Node.js
- Express.js
- MySQL through XAMPP

## Setup

### 1. Start XAMPP

Open XAMPP and start **MySQL**.

### 2. Create the database

Open phpMyAdmin and import:

`sql/todo_app.sql`

This creates the `todo_app` database and `tasks` table.

### 3. Install Node packages

Open PowerShell in this project folder:

```bash
npm install
```

### 4. Start the server

```bash
npm start
```

Open:

`http://localhost:3000`

## API Routes

- `GET /api/tasks` - get all tasks
- `POST /api/tasks` - add a task
- `PUT /api/tasks/:id` - update completed status
- `DELETE /api/tasks/:id` - delete a task
