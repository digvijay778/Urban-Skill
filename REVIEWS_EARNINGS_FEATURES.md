# Reviews & Earnings Features

## ✅ Completed Features

### 1. Worker Reviews Page (`/worker/reviews`)
**Location:** `frontend/src/pages/worker/Reviews.jsx`

**Features:**
- Overall rating display with average score
- Total review count
- Star rating distribution (5★ to 1★ with visual bars)
- Complete list of all reviews with:
  - Customer name
  - Rating (star display)
  - Review comment
  - Date posted
  - Associated booking ID
- Empty state message when no reviews exist

**Navigation:** Added to worker sidebar menu with ⭐ icon

---

### 2. Worker Earnings Page (`/worker/earnings`)
**Location:** `frontend/src/pages/worker/Earnings.jsx`

**Features:**
- **Stats Cards:**
  - Total Earnings (all time)
  - This Month earnings (with % comparison to last month)
  - Last Month earnings
  - Pending earnings (from active bookings)
  
- **Earnings History Table:**
  - Date of booking
  - Customer information (name & email)
  - Service details
  - Status badge
  - Amount earned
  - Link to booking details
  
- **Filters:**
  - All bookings
  - Completed (paid bookings)
  - Pending (active bookings)

**Navigation:** Added to worker sidebar menu with 💰 icon

---

### 3. Customer Review System
**Location:** `frontend/src/pages/customer/BookingDetails.jsx`

**Features:**
- **Review Modal:**
  - Star rating selector (1-5 stars)
  - Comment textarea
  - Submit/Cancel buttons
  - Validation (requires comment)
  
- **Review Display:**
  - Shows existing review if already submitted
  - Displays rating with stars
  - Shows review date
  - Shows review comment
  
- **Access Control:**
  - Only available for COMPLETED bookings
  - "Leave a Review" button appears after job completion
  - Prevents duplicate reviews (shows existing review instead)

**Backend API:**
- POST `/api/reviews/:bookingId` - Submit review
- GET `/api/reviews/booking/:bookingId` - Get existing review
- GET `/api/reviews/worker/:workerId` - Get all worker reviews

---

## Updated Navigation

### Worker Dashboard Sidebar
1. 📊 Dashboard
2. 👤 My Profile  
3. 📅 My Bookings
4. 📆 Availability
5. **💰 Earnings** ← NEW
6. **⭐ Reviews** ← NEW

---

## How to Use

### For Workers:

1. **View Reviews:**
   - Navigate to "Reviews" in the sidebar
   - See your overall rating and distribution
   - Read all customer reviews
   - Track your reputation

2. **Track Earnings:**
   - Navigate to "Earnings" in the sidebar
   - View total earnings and monthly breakdown
   - Monitor pending earnings from active jobs
   - Filter by completed or pending bookings
   - Click "View Details" to see individual booking info

### For Customers:

1. **Leave a Review:**
   - Go to "My Bookings"
   - Click on a COMPLETED booking
   - Click "Leave a Review" button
   - Select star rating (1-5)
   - Write your comment
   - Click "Submit Review"
   
2. **View Your Review:**
   - Your submitted review appears on the booking details page
   - Shows when you posted it
   - Cannot submit duplicate reviews

---

## Database Schema

### Review Model
```javascript
{
  bookingId: ObjectId (ref: Booking),
  customerId: ObjectId (ref: User),
  workerId: ObjectId (ref: User),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Routes Added to Router

**File:** `frontend/src/router.jsx`

```javascript
// Worker routes
{
  path: 'reviews',
  element: <WorkerReviews />,
},
{
  path: 'earnings',
  element: <WorkerEarnings />,
}
```

---

## Technical Implementation

### Reviews Page
- Fetches worker profile to get userId
- Gets all reviews via `/api/reviews/worker/:workerId`
- Calculates statistics (average, distribution)
- Renders star ratings dynamically
- Shows rating distribution with percentage bars

### Earnings Page
- Fetches bookings via `/api/bookings/my-bookings?role=WORKER`
- Filters by status (COMPLETED, PENDING, etc.)
- Calculates:
  - Total earnings (sum of completed jobs)
  - Monthly earnings (filtered by date)
  - Month-over-month comparison
  - Pending earnings (active bookings)
- Displays in formatted currency
- Interactive filter buttons

### Customer Reviews
- Modal-based review submission
- Star rating interaction with hover effects
- Validation before submission
- Prevents duplicate reviews
- Shows success toast on submission
- Displays existing review if present

---

## Next Steps (Optional Enhancements)

1. **Review Response:** Allow workers to respond to reviews
2. **Review Editing:** Allow customers to edit their reviews
3. **Review Sorting:** Sort by date, rating, etc.
4. **Earnings Export:** Download earnings report as CSV/PDF
5. **Payment Integration:** Link to actual payment processing
6. **Review Photos:** Allow customers to upload photos with reviews
7. **Helpful Votes:** Allow users to mark reviews as helpful

---

## Testing Checklist

- [x] Worker can view all their reviews
- [x] Review statistics calculate correctly
- [x] Customer can submit review on completed booking
- [x] Review submission validates required fields
- [x] Duplicate review prevention works
- [x] Worker can view earnings dashboard
- [x] Earnings calculations are accurate
- [x] Filter buttons work properly
- [x] All dates format correctly
- [x] Currency formats correctly
- [x] Navigation links work
- [x] Mobile responsive design

---

## Files Created/Modified

### Created:
1. `frontend/src/pages/worker/Reviews.jsx`
2. `frontend/src/pages/worker/Earnings.jsx`

### Modified:
1. `frontend/src/router.jsx` - Added new routes
2. `frontend/src/components/layout/DashboardLayout.jsx` - Updated sidebar (already had entries)
3. `frontend/src/pages/customer/BookingDetails.jsx` - Already had review functionality
4. `frontend/src/features/booking/bookingSlice.js` - Fixed role parameter

---

## Server Status

- Backend: Running on http://localhost:5000 ✅
- Frontend: Running on http://localhost:3001 ✅
- MongoDB: Connected successfully ✅

All features are ready to use!
