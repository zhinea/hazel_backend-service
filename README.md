# Browser Recorder API

A backend service for the Hazel Browser Recorder extension that provides cloud synchronization, authentication, and storage for browser recordings.

## Overview

This API allows users to store, retrieve, and manage their browser recordings in the cloud. It provides secure authentication via Auth0 and stores recording data in a PostgreSQL database using TypeORM.

## Features

- **Authentication**: Secure user authentication via Auth0 OIDC
- **Recording Management**: Create, read, update, and delete recording sessions
- **User Management**: User data synchronization with Auth0
- **Data Validation**: Request validation using Zod schemas
- **TypeScript Support**: Fully typed codebase for reliability

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) - a lightweight web framework
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Auth0 OIDC authentication
- **Runtime**: [Bun](https://bun.sh/) for JavaScript/TypeScript
- **Validation**: Zod for schema validation

## API Routes

### Authentication
- `GET /auth/callback` - Auth0 callback handler
- `GET /logout` - Logout endpoint
- `GET /me` - Get current user information

### Records
- `GET /records` - Get all records for the authenticated user
- `POST /records` - Create a new record
- `GET /records/:id` - Get a specific record by ID
- `PUT /records/:id` - Update a specific record
- `DELETE /records/:id` - Delete a specific record

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── RecordController.ts
│   ├── UserController.ts
│   └── auth/
│       └── AuthController.ts
├── entities/             # TypeORM entities
│   ├── Record.ts
│   └── User.ts
├── middleware/           # Custom middleware
│   └── authenticate.middleware.ts
├── routes/               # Route definitions
│   └── records.route.ts
├── schema/               # Zod validation schemas
│   └── record.schema.ts
├── services/             # Business logic
│   ├── RecordService.ts
│   └── UserService.ts
├── data-source.ts        # TypeORM configuration
└── index.ts              # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v16+) or Bun
- PostgreSQL database
- Auth0 account

### Environment Variables
Create a `.env` file with the following variables:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=record_db
OIDC_ISSUER=https://your-auth0-domain
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/browser-recorder-api.git
   cd browser-recorder-api
   ```

2. Install dependencies
   ```
   npm install
   # or with Bun
   bun install
   ```

3. Start the development server
   ```
   npm run dev
   # or with Bun
   bun dev
   ```

## Database Schema

### Records Table
| Column    | Type       | Description                           |
|-----------|------------|---------------------------------------|
| id        | UUID       | Primary key                           |
| user_id   | String     | Auth0 user ID                         |
| name      | String     | Record name                           |
| timestamp | Timestamp  | When the recording was created        |
| tabUrl    | String     | URL where the recording was made      |
| events    | JSON       | Recorded browser events               |

## Authentication Flow

The API uses Auth0 for authentication via the OIDC protocol. The authentication flow is as follows:

1. User logs in through the browser extension
2. Authentication request is sent to Auth0
3. User completes authentication on Auth0
4. Auth0 redirects back to the application with an authorization code
5. The application exchanges the code for access tokens
6. The API verifies the token and creates a session for the user

## Development

### Running Tests
```
npm test
# or with Bun
bun test
```

### Building for Production
```
npm run build
# or with Bun
bun run build
```

### Deployment
The API can be deployed to any platform that supports Node.js or Bun, such as:
- AWS Lambda
- Vercel
- Deno Deploy
- Railway
- Fly.io

## API Usage Examples

### Creating a New Recording

```javascript
// Request
POST /records
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "name": "Login Flow Recording",
  "tabUrl": "https://example.com/login",
  "events": [
    {
      "type": "click",
      "selector": "#username",
      "timestamp": 1618850301045
    },
    // More events...
  ]
}

// Response
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "auth0|123456789",
  "name": "Login Flow Recording",
  "timestamp": "2023-04-20T12:34:56.789Z",
  "tabUrl": "https://example.com/login",
  "events": [
    // Events array...
  ]
}
```

## License

[MIT License](LICENSE)

## Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).