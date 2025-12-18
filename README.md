# 🛠️ Urban-Skill

<div align="center">
  
  ### *Your Gateway to Skilled Professionals*
  
  A modern freelance marketplace connecting skilled workers with customers for home services, repairs, and professional work.
  
  ![MERN Stack](https://img.shields.io/badge/MERN-Stack-brightgreen)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
  ![Express.js](https://img.shields.io/badge/Express.js-4.18.2-lightgrey)
  ![React](https://img.shields.io/badge/React-18.2.0-blue)
  ![Node.js](https://img.shields.io/badge/Node.js-Latest-green)
  ![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About

**Urban-Skill** is a comprehensive freelance marketplace platform that bridges the gap between skilled workers and customers seeking professional services. Whether you need a plumber, electrician, carpenter, or any skilled professional, Urban-Skill makes it easy to find, book, and manage services all in one place.

### Why Urban-Skill?

- 🔍 **Easy Discovery** - Find skilled workers in your area with advanced search and filtering
- 📅 **Seamless Booking** - Schedule services at your convenience with real-time availability
- 💰 **Secure Payments** - Integrated Razorpay payment gateway for safe transactions
- ⭐ **Trust & Reviews** - Make informed decisions with verified worker profiles and customer reviews
- 📊 **Complete Dashboard** - Manage bookings, track status, and handle payments effortlessly
- 🛡️ **Admin Panel** - Comprehensive admin tools for platform management and worker verification

---

## ✨ Features

### For Customers
- 🔐 **Secure Authentication** - JWT-based authentication with refresh tokens
- 👤 **Profile Management** - Update personal information and preferences
- 🔎 **Worker Discovery** - Search and filter workers by category, location, and ratings
- 📝 **Service Booking** - Create bookings with detailed requirements and schedules
- 💳 **Payment Integration** - Secure online payments through Razorpay
- 📊 **Booking Dashboard** - Track all bookings with real-time status updates
- ⭐ **Review System** - Rate and review workers after service completion

### For Workers
- 📋 **Professional Profiles** - Showcase skills, experience, and portfolio
- 📄 **Document Verification** - Upload Aadhar and professional certificates
- 📸 **Profile Pictures** - Cloudinary integration for image management
- 📅 **Booking Management** - Accept, reject, or complete bookings
- 💰 **Earnings Tracking** - Monitor income and payment history
- ⏰ **Availability Management** - Set working hours and availability
- 📈 **Performance Analytics** - View ratings, reviews, and statistics

### For Admins
- 👥 **User Management** - Manage customer and worker accounts
- ✅ **Worker Verification** - Approve or reject worker registrations
- 📊 **Platform Analytics** - View platform statistics and insights
- 🔍 **Content Moderation** - Monitor reviews and manage reports

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **Vite 5.0.8** - Fast build tool and dev server
- **Redux Toolkit 2.0.1** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios 1.6.2** - HTTP client
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 7.0.0** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Cloudinary 1.33.0** - Image and file storage
- **Razorpay 2.8.4** - Payment gateway
- **Multer** - File upload handling
- **Winston** - Logging

### Tools & Services
- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary** - Cloud storage for images and documents
- **Razorpay** - Payment processing
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB)
- **Cloudinary account**
- **Razorpay account** (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/digvijay778/Urban-Skill.git
   cd Urban-Skill
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables** (see below)

5. **Seed the Database** (optional)
   ```bash
   cd backend
   node scripts/seed.js
   ```

6. **Start the Development Servers**

   **Backend** (in one terminal):
   ```bash
   cd backend
   npm run dev
   # Backend runs on http://localhost:5000
   ```

   **Frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

### Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 💻 Usage

### Test Accounts

After seeding the database, you can use these test accounts:

**Admin Account:**
- Email: `admin@urbanskill.com`
- Password: `Admin@123`

**Worker Account:**
- Email: `rahul.sharma@example.com`
- Password: `Worker@123`

**Customer Account:**
- Email: `priya.patel@example.com`
- Password: `Customer@123`

### User Flows

1. **Customer Journey**
   - Register/Login → Browse Workers → Book Service → Make Payment → Leave Review

2. **Worker Journey**
   - Register with Documents → Admin Verification → Manage Bookings → Complete Services → Receive Payments

3. **Admin Journey**
   - Login → Verify Workers → Manage Users → Monitor Platform

---

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register           - Register new customer
POST   /api/auth/register-worker    - Register new worker
POST   /api/auth/login              - Login user
POST   /api/auth/logout             - Logout user
POST   /api/auth/refresh-token      - Refresh access token
```

### User Endpoints
```
GET    /api/users/profile           - Get user profile
PATCH  /api/users/profile           - Update user profile
```

### Worker Endpoints
```
GET    /api/workers                 - Get all workers (with filters)
GET    /api/workers/:id             - Get worker details
GET    /api/workers/profile         - Get worker's own profile
PATCH  /api/workers/profile         - Update worker profile
GET    /api/workers/categories      - Get service categories
```

### Booking Endpoints
```
POST   /api/bookings                - Create new booking
GET    /api/bookings/my-bookings    - Get user's bookings
GET    /api/bookings/:id            - Get booking details
PATCH  /api/bookings/:id/status     - Update booking status
PATCH  /api/bookings/:id/cancel     - Cancel booking
```

### Payment Endpoints
```
POST   /api/payments/create-order   - Create Razorpay order
POST   /api/payments/verify         - Verify payment
GET    /api/payments/:id            - Get payment details
```

### Review Endpoints
```
POST   /api/reviews                 - Create review
GET    /api/reviews/worker/:id      - Get worker reviews
PATCH  /api/reviews/:id             - Update review
DELETE /api/reviews/:id             - Delete review
```

### Admin Endpoints
```
GET    /api/admin/users             - Get all users
GET    /api/admin/workers/pending   - Get pending verifications
PATCH  /api/admin/workers/:id/verify - Verify worker
GET    /api/admin/stats             - Get platform statistics
```

---

## 📁 Project Structure

```
Urban-Skill/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── validators/      # Request validators
│   ├── scripts/             # Database seeding scripts
│   ├── tests/               # Test files
│   └── server.js            # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Feature-specific code
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   └── public/              # Static assets
│
└── README.md
```

---

## 📸 Screenshots

### Home Page
*Browse skilled workers and discover services near you*

### Worker Profile
*Detailed profiles with ratings, reviews, and availability*

### Booking Dashboard
*Track all your bookings with real-time status updates*

### Admin Panel
*Comprehensive tools for platform management*

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Digvijay Rana**

- GitHub: [@digvijay778](https://github.com/digvijay778)
- Email: digvijayrana369@gmail.com

**Project Link:** [https://github.com/digvijay778/Urban-Skill](https://github.com/digvijay778/Urban-Skill)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
- [Razorpay](https://razorpay.com/)

---

<div align="center">
  
  ### ⭐ Star this repo if you find it useful!
  
  Made with ❤️ by Digvijay Rana
  
</div>
