# Freelance Platform Backend

A comprehensive Node.js/Express backend API for a freelance platform with user authentication, worker profiles, booking management, payment processing with Razorpay, and review systems.

## Features

- **User Management**: Registration, login, profile management with role-based access (Customer, Worker, Admin)
- **Worker Profiles**: Detailed worker profiles with skills, experience, hourly rates, and availability
- **Booking System**: Complete booking lifecycle from creation to completion with status tracking
- **Payment Processing**: Razorpay integration for secure payment handling and refunds
- **Review & Rating**: Comprehensive review system with category-based ratings
- **Admin Dashboard**: Analytics and statistics for platform management
- **Authentication**: JWT-based authentication with token refresh
- **Security**: CORS, Helmet for security headers, rate limiting, input validation

## Prerequisites

- Node.js v14 or higher
- npm or yarn
- MongoDB (local or cloud)
- Razorpay account for payment processing

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd freelance-platform-backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create `.env` file
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`

## Environment Variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelance_platform
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
LOG_LEVEL=info
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Code Formatting
```bash
npm run format
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - Get all users (paginated)

### Workers
- `POST /api/workers/profile` - Create worker profile
- `GET /api/workers/:id` - Get worker profile
- `PATCH /api/workers/profile` - Update worker profile
- `GET /api/workers` - Get all workers (with filters)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/my-bookings` - Get user's bookings
- `PATCH /api/bookings/:id/status` - Update booking status
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/:id/refund` - Refund payment
- `POST /api/payments/webhook` - Razorpay webhook

### Reviews
- `POST /api/reviews/:bookingId` - Create review
- `GET /api/reviews/worker/:workerId` - Get worker reviews
- `GET /api/reviews/booking/:bookingId` - Get booking review
- `PATCH /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/analytics/:userId` - Get user analytics

## Project Structure

```
freelance-platform-backend/
├── src/
│   ├── config/              # Configuration files
│   ├── constants/           # Application constants
│   ├── models/              # MongoDB schemas
│   ├── middlewares/         # Express middlewares
│   ├── utils/               # Utility functions
│   ├── validators/          # Input validation schemas
│   ├── services/            # Business logic
│   ├── controllers/         # Route controllers
│   ├── routes/              # API routes
│   └── app.js               # Express app setup
├── tests/                   # Test files
├── uploads/                 # Uploaded files directory
├── logs/                    # Application logs
├── .env                     # Environment variables
├── .env.example             # Example environment file
├── package.json             # Dependencies
├── server.js                # Server entry point
└── README.md                # This file
```

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": []
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Rate Limiting**: Prevents abuse with request rate limiting
- **Input Validation**: Express-validator for input sanitization
- **CORS**: Cross-Origin Resource Sharing configuration
- **Helmet**: Security headers protection

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For support, email support@freelanceplatform.com or create an issue in the repository.
