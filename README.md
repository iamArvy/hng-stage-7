# Open School API: Secure Auth & Payments Gateway 🔐

This project serves as a robust backend API for an Open School Portal, meticulously crafted with TypeScript, NestJS, and Prisma. It provides essential functionalities including secure user authentication via Google OAuth2 and JWT, comprehensive user management, and seamless payment processing integrated with Paystack. Designed for high performance and maintainability, it leverages modern architectural patterns, robust logging with Winston, and thorough validation to ensure data integrity and system stability.

## Overview
This backend API is built using TypeScript with the NestJS framework, integrating Prisma ORM for database interactions and providing secure authentication via JWT and Google OAuth2, alongside payment processing capabilities through Paystack.

## Features
-   **User Authentication**: Secure user registration and login, including Google OAuth2 integration and JWT-based authentication.
-   **User Management**: Core functionalities for creating, retrieving, updating, and deleting user profiles.
-   **Payment Processing**: Integration with Paystack for initiating and verifying payments, and handling webhooks for transaction updates.
-   **Database Management**: Utilizes PostgreSQL with Prisma ORM for efficient and type-safe database operations.
-   **Robust Logging**: Comprehensive request and error logging powered by Winston.
-   **Global Error Handling**: Centralized exception filtering for consistent and informative error responses.
-   **API Documentation**: Automatically generated interactive API documentation using Swagger.
-   **Configuration Management**: Environment-specific configuration with Joi validation.

## Getting Started

### Installation
To get this project up and running on your local machine, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/iamArvy/hng-stage-7.git
    cd hng-stage-7
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Docker Setup (Database)**:
    Ensure Docker is installed and running. This project uses Docker Compose to set up a PostgreSQL database.
    ```bash
    docker-compose up -d
    ```
    This command will start a PostgreSQL container named `stage-7-postgres-db` on port `5432`.

### Environment Variables
Create a `.env` file in the project root based on the `.env.example` file and populate it with your specific configurations.

```ini
# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Paystack API Keys
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key

# Database Configuration
DATABASE_URL="postgresql://admin:rootpassword@localhost:5432/stage_7_db?schema=public"

# JWT Secret
JWT_SECRET=supersecretjwtkey

# Application Configuration (Optional, defaults are provided)
NODE_ENV=development
PORT=3000
APP_NAME="Open School Portal"
APP_SLUG=open-school-portal
APP_HOST=localhost
APP_URL=http://localhost:3000
APP_PREFIX=api
APP_VERSION=v1
APP_DESCRIPTION="Open School Portal API"
```

### Database Migrations
Apply the Prisma database schema and run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Running the Application

**Development Mode**:
```bash
npm run start:dev
```
The application will run in development mode, watching for file changes and hot-reloading.

**Production Mode**:
```bash
npm run build
npm run start:prod
```
This will build the application and then run it in production mode.

## Usage
Once the application is running, you can access the API and its documentation:

*   **API Root**: `http://localhost:3000/api/v1`
*   **API Documentation (Swagger)**: `http://localhost:3000/docs`

The Swagger UI provides an interactive interface to explore and test all available API endpoints. For authenticated endpoints, use the `Authorize` button in Swagger to input your JWT bearer token obtained after successful login.

## API Documentation

### Base URL
`http://localhost:3000/api/v1`

### Endpoints

#### GET /auth/google
Initiates the Google OAuth2 authentication flow by redirecting the user to Google's authentication page.

**Request**:
No request body.

**Response**:
Redirects to the Google authentication URL.
```json
{
  "google_auth_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent"
}
```

**Errors**:
- `400 Bad Request`: Google authentication failed.

#### GET /auth/google/callback
Handles the callback from Google OAuth2 after successful authentication, processes user data, and issues JWT tokens.

**Request**:
Query parameters (handled internally by Google OAuth2 flow).

**Response**:
```json
{
  "user": {
    "id": "clt9g6b3j00003e6n7u2b5v3x",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture": "https://lh3.googleusercontent.com/a/...",
    "created_at": "2023-10-27T10:00:00.000Z",
    "updated_at": "2023-10-27T10:00:00.000Z"
  },
  "access": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200
  }
}
```

**Errors**:
- `400 Bad Request`: Google authentication failed or no user found.

#### POST /payments/paystack/initialize
**Authentication**: Bearer Token required.

Initializes a new payment transaction with Paystack. A record for the payment is created in the local database.

**Request**:
```json
{
  "amount": 5000
}
```
**Request Fields**:
- `amount` (integer, required): The amount to be paid, in Kobo (e.g., 5000 for ₦50.00). Must be at least 1.

**Response**:
```json
{
  "reference": "your_payment_id_uuid",
  "authorization_url": "https://checkout.paystack.com/abcdef12345"
}
```
**Response Fields**:
- `reference` (string): Unique reference generated by Paystack (which is the local payment ID).
- `authorization_url` (string): URL where the user should be redirected to complete the payment.

**Errors**:
- `401 Unauthorized`: No authentication token or invalid token.
- `404 Not Found`: User not found.
- `400 Bad Request`: Invalid amount or other validation errors.
- `503 Service Unavailable`: Paystack client not configured.
- `5xx Internal Server Error`: Paystack API error or internal server issues.

#### POST /payments/paystack/webhook
Receives and processes webhook notifications from Paystack regarding transaction status updates.

**Request**:
Paystack webhook payload (example: `{"event":"charge.success", "data":{...}}`). The exact structure is defined by Paystack.

**Response**:
```json
{
  "status": true
}
```

**Errors**:
- `400 Bad Request`: Invalid Paystack signature or malformed payload.
- `500 Internal Server Error`: Error processing the webhook or updating the database.

#### GET /payments
**Authentication**: Bearer Token required.

Retrieves a list of all payment records.

**Request**:
No request body.

**Response**:
```json
[
  {
    "id": "your_payment_id_uuid_1",
    "user_id": "user_uuid_1",
    "payment_method": "PAYSTACK",
    "amount": 5000,
    "status": "completed",
    "paid_at": "2023-10-27T09:30:00.000Z",
    "created_at": "2023-10-27T09:00:00.000Z",
    "updated_at": "2023-10-27T09:30:00.000Z"
  },
  {
    "id": "your_payment_id_uuid_2",
    "user_id": "user_uuid_2",
    "payment_method": "PAYSTACK",
    "amount": 10000,
    "status": "pending",
    "paid_at": null,
    "created_at": "2023-10-27T10:00:00.000Z",
    "updated_at": "2023-10-27T10:00:00.000Z"
  }
]
```
**Response Fields**:
- `id` (string): Unique payment identifier.
- `user_id` (string): ID of the user who made the payment.
- `payment_method` (enum: "PAYSTACK", "STRIPE"): Method used for payment.
- `amount` (float): Payment amount.
- `status` (string): Current status of the payment (e.g., "pending", "completed", "failed").
- `paid_at` (datetime, nullable): Timestamp when the payment was completed.
- `created_at` (datetime): Timestamp when the payment record was created.
- `updated_at` (datetime): Timestamp when the payment record was last updated.

**Errors**:
- `401 Unauthorized`: No authentication token or invalid token.
- `500 Internal Server Error`: Database error or other internal server issues.

#### GET /payments/:id/status
**Authentication**: Bearer Token required.

Checks the status of a specific payment by its ID. Optionally refreshes the status from Paystack if the payment is pending or `refresh` is true.

**Request**:
No request body.
Path Parameters:
- `id` (string, required): The ID of the payment.
Query Parameters:
- `refresh` (boolean, optional): If `true`, forces a status check with Paystack. Default is `false`.

**Response**:
```json
{
  "id": "your_payment_id_uuid",
  "user_id": "user_uuid",
  "payment_method": "PAYSTACK",
  "amount": 5000,
  "status": "completed",
  "paid_at": "2023-10-27T09:30:00.000Z",
  "created_at": "2023-10-27T09:00:00.000Z",
  "updated_at": "2023-10-27T09:30:00.000Z"
}
```
**Response Fields**:
- `id` (string): Unique payment identifier.
- `user_id` (string): ID of the user who made the payment.
- `payment_method` (enum: "PAYSTACK", "STRIPE"): Method used for payment.
- `amount` (float): Payment amount.
- `status` (string): Current status of the payment (e.g., "pending", "completed", "failed").
- `paid_at` (datetime, nullable): Timestamp when the payment was completed.
- `created_at` (datetime): Timestamp when the payment record was created.
- `updated_at` (datetime): Timestamp when the payment record was last updated.

**Errors**:
- `401 Unauthorized`: No authentication token or invalid token.
- `404 Not Found`: Payment with the given ID not found.
- `5xx Internal Server Error`: Paystack API error or internal server issues.

#### POST /user
**Authentication**: Currently not enforced, but typically would be.

Creates a new user account.

**Request**:
```json
{
  "email": "new.user@example.com",
  "first_name": "New",
  "last_name": "User",
  "password": "StrongPassword123"
}
```
**Request Fields**:
- `email` (string, required): User's unique email address.
- `first_name` (string, required): User's first name.
- `last_name` (string, required): User's last name.
- `password` (string, required): User's password (for local authentication).

**Response**:
Currently returns a placeholder string, but typically would return the created `UserResponseDto`.
```json
"This action adds a new user"
```

**Errors**:
- `400 Bad Request`: Validation errors (e.g., email already exists, invalid password format).

#### GET /user
**Authentication**: Currently not enforced, but typically would be.

Retrieves a list of all registered users.

**Request**:
No request body.

**Response**:
Currently returns a placeholder string, but typically would return an array of `UserResponseDto`.
```json
"This action returns all user"
```

**Errors**:
- `500 Internal Server Error`: Database error or other internal server issues.

#### GET /user/:id
**Authentication**: Currently not enforced, but typically would be.

Retrieves details for a specific user by ID.

**Request**:
No request body.
Path Parameters:
- `id` (string, required): The ID of the user.

**Response**:
Currently returns a placeholder string, but typically would return a `UserResponseDto`.
```json
"This action returns a #1 user"
```

**Errors**:
- `404 Not Found`: User with the given ID not found.
- `500 Internal Server Error`: Database error or other internal server issues.

#### PATCH /user/:id
**Authentication**: Currently not enforced, but typically would be.

Updates partial details for a specific user by ID.

**Request**:
```json
{
  "first_name": "Updated",
  "profile_picture": "http://example.com/new-pic.jpg"
}
```
**Request Fields**:
- `email` (string, optional): New email address.
- `first_name` (string, optional): New first name.
- `last_name` (string, optional): New last name.
- `password` (string, optional): New password.
- `profile_picture` (string, optional): New profile picture URL.

**Response**:
Currently returns a placeholder string, but typically would return the updated `UserResponseDto`.
```json
"This action updates a #1 user"
```

**Errors**:
- `404 Not Found`: User with the given ID not found.
- `400 Bad Request`: Validation errors (e.g., invalid email format).
- `500 Internal Server Error`: Database error or other internal server issues.

#### DELETE /user/:id
**Authentication**: Currently not enforced, but typically would be.

Deletes a specific user by ID.

**Request**:
No request body.
Path Parameters:
- `id` (string, required): The ID of the user.

**Response**:
Currently returns a placeholder string, but typically indicates successful deletion.
```json
"This action removes a #1 user"
```

**Errors**:
- `404 Not Found`: User with the given ID not found.
- `500 Internal Server Error`: Database error or other internal server issues.

## Technologies Used

| Category          | Technology                                                                                                  | Description                                                          |
| :---------------- | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| **Backend**       | [TypeScript](https://www.typescriptlang.org/)                                                               | Typed superset of JavaScript that compiles to plain JavaScript.      |
|                   | [Node.js](https://nodejs.org/en/)                                                                           | JavaScript runtime built on Chrome's V8 JavaScript engine.           |
|                   | [NestJS](https://nestjs.com/)                                                                               | Progressive Node.js framework for building efficient, scalable apps. |
| **Database**      | [PostgreSQL](https://www.postgresql.org/)                                                                   | Powerful, open-source object-relational database system.           |
| **ORM**           | [Prisma](https://www.prisma.io/)                                                                            | Next-generation ORM for Node.js and TypeScript.                      |
| **Authentication**| [Passport.js](http://www.passportjs.org/)                                                                   | Simple, unobtrusive authentication middleware for Node.js.           |
|                   | [JWT](https://jwt.io/)                                                                                      | JSON Web Tokens for secure information transmission.                 |
|                   | [Google OAuth20](https://developers.google.com/identity/protocols/oauth2)                                   | OAuth 2.0 protocol for secure API authorization.                     |
| **Payments**      | [Paystack](https://paystack.com/)                                                                           | Payment gateway for online transactions.                             |
| **Logging**       | [Winston](https://github.com/winstonjs/winston)                                                             | A versatile logging library for Node.js.                             |
|                   | [Nest-Winston](https://github.com/gremo/nest-winston)                                                       | Winston integration for NestJS.                                      |
| **Validation**    | [Class-validator](https://github.com/typestack/class-validator)                                             | Decorator-based object validation.                                   |
|                   | [Joi](https://joi.dev/)                                                                                     | Schema description language and data validator.                      |
| **API Docs**      | [Swagger](https://swagger.io/) ([@nestjs/swagger](https://docs.nestjs.com/openapi/introduction))            | OpenAPI specification for REST APIs.                                 |
| **HTTP Client**   | [Axios](https://axios-http.com/)                                                                            | Promise-based HTTP client for the browser and Node.js.               |
| **Containerization**| [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)                      | Platform for developing, shipping, and running applications.         |

## License
This project is UNLICENSED.

## Author Info

-   **Your Name**: [Your Social Media (e.g., LinkedIn)](https://linkedin.com/in/your-username) | [Your Portfolio/Website](https://your-website.com)
-   **Email**: [your.email@example.com](mailto:your.email@example.com)

---
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![Winston](https://img.shields.io/badge/Winston-3B3B3B?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://github.com/winstonjs/winston)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)