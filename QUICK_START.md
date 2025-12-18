# 🚀 Quick Start Guide - Urban Skill Platform

## Prerequisites

- Node.js 14+ installed
- MongoDB installed and running
- Git (optional)

## 1️⃣ Backend Setup (5 minutes)

### Step 1: Navigate to Backend
```bash
cd c:\Users\digvi\OneDrive\Desktop\placemet\backend
```

### Step 2: Install Dependencies (Already Done ✅)
```bash
npm install
```

### Step 3: Create Environment File
Create a file named `.env` in the backend folder:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urban-skill
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Note**: The backend will run even without MongoDB/Cloudinary/Razorpay configured. These services are optional for basic testing.

### Step 4: Start Backend Server (Already Running ✅)
```bash
npm start
```

✅ Backend should be running on: **http://localhost:5000**

---

## 2️⃣ Frontend Setup (5 minutes)

### Step 1: Navigate to Frontend
```bash
cd c:\Users\digvi\OneDrive\Desktop\placemet\frontend
```

### Step 2: Install Dependencies (Already Done ✅)
```bash
npm install
```

### Step 3: Environment File (Already Created ✅)
File `.env` already exists with:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Step 4: Start Frontend Dev Server (Already Running ✅)
```bash
npm run dev
```

✅ Frontend should be running on: **http://localhost:3000**

---

## 3️⃣ Access the Application

### Open Browser
Navigate to: **http://localhost:3000**

### Test the Application

1. **Register a New User**
   - Click "Register" button
   - Fill in the form
   - Select role: Customer or Worker
   - Submit

2. **Login**
   - Use your registered credentials
   - Click "Sign In"

3. **Browse Workers** (if logged in as Customer)
   - Navigate to "Find Workers"
   - View worker profiles

4. **Worker Dashboard** (if logged in as Worker)
   - Complete your profile
   - Set availability
   - View bookings

---

## 🎯 Quick Test Scenarios

### Scenario 1: Customer Flow
1. Register as Customer
2. Browse workers
3. View worker details
4. Create a booking
5. View "My Bookings"

### Scenario 2: Worker Flow
1. Register as Worker
2. Complete worker profile
3. Set skills and hourly rate
4. Update availability
5. View worker dashboard

### Scenario 3: Admin Flow
1. Use admin credentials (create via MongoDB or seed script)
2. Access admin dashboard
3. View platform statistics
4. Manage users
5. Verify workers

---

## 🔧 Troubleshooting

### Backend Not Starting
- ✅ **Already running** - Check terminal showing "Server running on port 5000"
- If issues, check `backend/logs/` folder for errors

### Frontend Not Loading
- ✅ **Already running** - Check terminal showing "Local: http://localhost:3000/"
- Clear browser cache
- Check browser console for errors

### API Connection Issues
- Verify backend is running on port 5000
- Check `.env` files in both frontend and backend
- Ensure VITE_API_BASE_URL points to http://localhost:5000/api

### MongoDB Connection Failed
- The backend is designed to run without MongoDB for development
- Install MongoDB locally or use MongoDB Atlas
- Update MONGODB_URI in backend `.env`

---

## 📚 API Testing (Optional)

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "CUSTOMER"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📝 Default Ports

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017

---

## 🎨 Features to Try

### ✅ Implemented & Working
- User registration and login
- Protected routes
- Role-based dashboards
- Worker listing
- Service categories
- Profile management
- Booking interface (basic)
- Responsive design
- Toast notifications

### 🚧 In Progress / To Be Enhanced
- Complete booking flow with payment
- Review system
- Real-time notifications
- Advanced search and filters
- Worker verification workflow
- File uploads (requires Cloudinary)

---

## 🛑 Stopping the Application

### Stop Backend
Press `Ctrl + C` in the backend terminal

### Stop Frontend
Press `Ctrl + C` in the frontend terminal

---

## 📖 Next Steps

1. **Review Documentation**
   - Read `backend/README.md` for API details
   - Read `frontend/README.md` for component docs
   - Read `PROJECT_OVERVIEW.md` for complete overview

2. **Customize**
   - Update branding and colors in `tailwind.config.js`
   - Add your Cloudinary credentials for uploads
   - Configure Razorpay for payments

3. **Deploy**
   - Backend: Heroku, Railway, or Render
   - Frontend: Vercel or Netlify
   - Database: MongoDB Atlas

---

## ✨ Summary

**Current Status**: 
- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 3000
- ✅ 110+ files created
- ✅ Core features implemented
- ✅ Ready for development and testing

**What You Can Do Now**:
1. Open http://localhost:3000 in your browser
2. Create an account and explore
3. Test different user roles
4. Review the codebase
5. Start building additional features

---

**Congratulations! Your Urban Skill platform is ready! 🎉**
