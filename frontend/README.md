# Urban Skill - Frontend

Production-ready React frontend for the Urban Skill freelancing platform.

## Tech Stack

- **React 18.2** - UI library
- **Vite 5.0** - Build tool and dev server
- **Redux Toolkit 2.0** - State management
- **React Router v6** - Client-side routing
- **Axios 1.6** - HTTP client
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **date-fns** - Date formatting utilities

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── common/          # Button, Input, Modal, Loader, ProtectedRoute
│   ├── layout/          # Navbar, Footer, MainLayout, DashboardLayout
│   └── cards/           # WorkerCard, BookingCard, ServiceCard
├── features/            # Feature-based modules
│   ├── auth/            # Login, Register, authSlice
│   ├── worker/          # Worker components and workerSlice
│   └── booking/         # Booking components and bookingSlice
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication hook
│   ├── useRole.js       # Role-based authorization hook
│   └── useDebounce.js   # Debounce hook
├── pages/               # Page components
│   ├── customer/        # Customer pages (MyBookings, Profile)
│   ├── worker/          # Worker dashboard pages
│   └── admin/           # Admin dashboard pages
├── services/            # API and service layer
│   ├── api.js           # Axios instance with interceptors
│   └── tokenService.js  # Token management
├── store/               # Redux store configuration
│   └── index.js         # Store setup
├── utils/               # Utility functions
│   ├── constants.js     # Application constants
│   ├── formatDate.js    # Date formatting
│   └── formatCurrency.js # Currency formatting
├── App.jsx              # Root component
├── main.jsx             # Application entry point
├── router.jsx           # Route configuration
└── index.css            # Global styles

```

## Features Implemented

### Authentication
- ✅ User registration (Customer/Worker/Admin roles)
- ✅ Login with JWT token management
- ✅ Token refresh with automatic retry
- ✅ Protected routes with role-based access

### Common Components
- ✅ Button (multiple variants, sizes, loading states)
- ✅ Input, Select, TextArea (with validation)
- ✅ Modal (with portal rendering)
- ✅ Loader (fullscreen and inline)
- ✅ ProtectedRoute (role-based access control)

### Layout Components
- ✅ Navbar (responsive with mobile menu)
- ✅ Footer (with quick links)
- ✅ MainLayout (for public pages)
- ✅ DashboardLayout (for authenticated users)

### Pages
- ✅ Home (landing page with hero section)
- ✅ Services (service categories)
- ✅ Workers (worker listing)
- ✅ Worker Details
- ✅ My Bookings (customer)
- ✅ Profile (customer/worker)
- ✅ Worker Dashboard
- ✅ Admin Dashboard
- ✅ 404 Not Found
- ✅ 403 Unauthorized

### State Management
- ✅ Auth slice (login, register, logout, checkAuth)
- ✅ Worker slice (fetch workers, fetch by ID)
- ✅ Booking slice (fetch bookings, create booking, update status)

### API Integration
- ✅ Axios instance with base URL configuration
- ✅ Request interceptor (adds auth token)
- ✅ Response interceptor (handles token refresh)
- ✅ Token service (localStorage management)

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Getting Started

### Install Dependencies
```bash
cd frontend
npm install
```

### Start Development Server
```bash
npm run dev
```

The app will be available at: http://localhost:3000

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## API Integration

The frontend is configured to connect to the backend API running at `http://localhost:5000/api`.

The Vite proxy configuration automatically forwards API requests:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/services` - Service categories
- `/workers` - Browse workers
- `/workers/:id` - Worker details

### Customer Routes (Protected)
- `/my-bookings` - Customer bookings
- `/profile` - User profile

### Worker Routes (Protected)
- `/worker/dashboard` - Worker dashboard
- `/worker/profile` - Worker profile management
- `/worker/bookings` - Worker bookings
- `/worker/availability` - Manage availability

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/workers` - Worker verification

## Path Aliases

The following path aliases are configured in `vite.config.js`:

- `@` → `src/`
- `@components` → `src/components/`
- `@features` → `src/features/`
- `@pages` → `src/pages/`
- `@services` → `src/services/`
- `@hooks` → `src/hooks/`
- `@utils` → `src/utils/`
- `@store` → `src/store/`

Example usage:
```javascript
import Button from '@components/common/Button';
import { useAuth } from '@hooks/useAuth';
```

## State Management with Redux Toolkit

### Auth State
```javascript
const { user, token, loading, error } = useSelector((state) => state.auth);
```

### Worker State
```javascript
const { workers, currentWorker, loading, error } = useSelector((state) => state.worker);
```

### Booking State
```javascript
const { bookings, currentBooking, loading, error } = useSelector((state) => state.booking);
```

## Custom Hooks

### useAuth
```javascript
const { user, isAuthenticated, isCustomer, isWorker, isAdmin } = useAuth();
```

### useRole
```javascript
const { hasRole, hasAnyRole, isAllowed } = useRole(['CUSTOMER', 'WORKER']);
```

### useDebounce
```javascript
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

## Styling with Tailwind CSS

Custom theme configuration in `tailwind.config.js`:

- Primary color palette (50-950 shades)
- Inter font family
- Custom responsive breakpoints
- Extended spacing and border radius

## Toast Notifications

Using `react-hot-toast` for user feedback:

```javascript
import toast from 'react-hot-toast';

toast.success('Login successful!');
toast.error('Something went wrong');
```

## Next Steps

1. Implement remaining feature components:
   - Worker profile creation/editing
   - Booking creation flow
   - Payment integration (Razorpay)
   - Review and rating system
   - Admin verification workflow

2. Add more pages:
   - About Us
   - Contact
   - FAQ
   - Terms of Service
   - Privacy Policy

3. Enhance UI/UX:
   - Add loading skeletons
   - Implement pagination
   - Add search and filters
   - Image optimization
   - Error boundaries

4. Testing:
   - Unit tests with Jest
   - Component tests with React Testing Library
   - E2E tests with Cypress

## Notes

- Backend server must be running on port 5000
- MongoDB connection required for full functionality
- All protected routes require valid JWT token
- File uploads handled by Cloudinary integration in backend
