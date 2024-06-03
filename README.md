# Task And Sub-Task API

This is a simple Task Manager API built with Express.js and MongoDB. It includes functionality for managing tasks, sub-tasks, and users, as well as authentication using JWT tokens.

## Features

1. **Create Task:**

   - Input: subject, status, deadline with JWT Auth Token.

2. **Create Subtask:**

   - Input: Task ID, subject, deadline, status with Auth Token

3. **Get User Tasks and Subtask:**

   - Input: Auth Token

4. **Get User Subtasks by taskId:**

   - Input: TaskID, Auth Token

5. **Update Task:**

   - Update: subject, status, deadline
   - Input : taskId, subject, status, deadline, Auth Token

6. **Update Subtask:**

   - Update: subject, status, deadline
   - Input : subTaskId, subject, status, deadline, Auth Token

7. **Delete Task:**

   - Input: TaskId, Auth Token
   - Soft Deletion.

8. **Delete Subtask:**
   - Input: TaskId, Auth Token
   - Soft Deletion.

## Models

### Sub Task

- `id` (unique identifier)
- `task_id` (unique identifier) // references task table
- `subject` (String)
- `deadline` (Date)
- `status` (String)
- `is_deleted` (boolean)


### Task

- `id` (unique identifier)
- `user_id` (unique identifier) // references user table
- `subject` (String)
- `deadline` (Date)
- `status` (String)
- `is_deleted` (boolean)

### User

- `id` (int, unique identifier)
- `name` (String)
- `email` (String)

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up MongoDB and update the connection string in the code.
4. Run the server: `node server.js`.

## API Endpoints

- `POST /tasks/` - Create Task.
- `GET /tasks/` - Get User Tasks.
- `PUT /tasks/:taskId` - Update Task.
- `DELETE /tasks/:taskId` - Delete Task.

- `POST /tasks/:taskId/subtasks/` - Create Subtask.
- `GET /tasks/:taskId/subtasks/` - Get User Subtasks.
- `PUT /tasks/:subtaskId/subtasks` - Update Subtask.
- `DELETE /tasks/:subtaskId/subtasks` - Delete Subtask.

### Users

- `POST /users/register` - Register User.
- `POST /users/login` - User Login.

## Usage

1. Register and login to get the JWT Auth Token.
2. Use the token for authenticated requests to tasks and subtasks endpoints.

