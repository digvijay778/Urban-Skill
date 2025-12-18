# Razorpay Payment Integration Guide

## Overview
Complete Razorpay payment integration with worker wallet system for Urban Skill platform.

## Features Implemented

### 1. Worker Wallet System
- **Location**: `backend/src/models/WorkerProfile.js`
- Added `wallet` field with:
  - `balance`: Current wallet balance
  - `transactions`: Array of transaction history
    - Amount, type (CREDIT/DEBIT/WITHDRAWAL), description
    - Payment and booking references
    - Date and status tracking

### 2. Payment Service with Wallet Credit
- **Location**: `backend/src/services/paymentService.js`
- Enhanced payment verification:
  - Razorpay signature verification using HMAC SHA256
  - Automatic wallet credit on successful payment
  - Transaction history recording
  - Secure payment validation

### 3. Admin Payment Management
- **Backend Endpoint**: `GET /admin/payments`
  - Returns all payments with customer, worker, and booking details
  - Includes payment statistics (total, successful, pending, failed)
  
- **Frontend Page**: `frontend/src/pages/admin/ManagePayments.jsx`
  - Stats cards showing payment overview
  - Search and filter functionality
  - Detailed payment table with transaction IDs
  - Real-time status updates

### 4. Customer Payment Flow
- **Payment Modal**: `frontend/src/components/booking/PaymentModal.jsx`
  - Razorpay checkout integration
  - Secure payment processing
  - Payment verification
  - Error handling

- **Booking Details Page**: Updated to show "Pay Now" button
  - Appears when booking status is "ACCEPTED" and not paid
  - Shows payment amount
  - Informational message about wallet credit
  - Integrates with PaymentModal

### 5. Razorpay Integration
- Added Razorpay checkout script to `index.html`
- Environment variable: `VITE_RAZORPAY_KEY_ID`

## Setup Instructions

### 1. Backend Setup

1. **Add Razorpay credentials to .env**:
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

2. **Get Razorpay credentials**:
   - Sign up at https://razorpay.com
   - Go to Settings → API Keys
   - Generate Test/Live keys
   - Copy Key ID and Key Secret

### 2. Frontend Setup

1. **Add Razorpay Key ID to .env**:
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

2. **Restart development server** after adding environment variables

### 3. Testing the Payment Flow

1. **As Customer**:
   - Create a booking
   - Wait for worker to accept
   - Click "Pay Now" button on booking details page
   - Complete payment using Razorpay test cards:
     - Card: 4111 1111 1111 1111
     - Expiry: Any future date
     - CVV: Any 3 digits

2. **As Worker**:
   - Check wallet balance in dashboard/earnings page
   - View transaction history

3. **As Admin**:
   - Navigate to Admin → Payments
   - View all platform payments
   - See payment statistics
   - Search and filter payments

## Payment Flow

```
Customer creates booking
    ↓
Worker accepts booking
    ↓
Customer sees "Pay Now" button
    ↓
Customer clicks "Pay Now"
    ↓
PaymentModal opens
    ↓
Razorpay order created (backend)
    ↓
Razorpay checkout opens
    ↓
Customer completes payment
    ↓
Payment verification (backend)
    ↓
Signature validation
    ↓
Worker wallet credited
    ↓
Transaction recorded
    ↓
Booking updated with paymentId
    ↓
Success notification
```

## API Endpoints

### Payment Endpoints
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment and credit wallet
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/refund/:id` - Process refund

### Admin Endpoints
- `GET /api/admin/payments` - Get all payments with stats

## Database Schema Changes

### WorkerProfile Model
```javascript
wallet: {
  balance: Number (default: 0),
  transactions: [{
    amount: Number,
    type: String (CREDIT/DEBIT/WITHDRAWAL),
    description: String,
    paymentId: ObjectId,
    bookingId: ObjectId,
    date: Date,
    status: String (PENDING/COMPLETED/FAILED)
  }]
}
```

## Security Features

1. **Payment Signature Verification**
   - HMAC SHA256 signature validation
   - Prevents payment tampering

2. **Razorpay Webhook Support**
   - Ready for webhook integration
   - Automatic payment status updates

3. **Transaction Logging**
   - Complete audit trail
   - All wallet operations recorded

## Future Enhancements

1. **Worker Wallet Withdrawal**
   - Allow workers to withdraw funds
   - Bank account integration
   - Withdrawal requests approval

2. **Payment History for Customers**
   - Customer payment dashboard
   - Invoice generation
   - Download payment receipts

3. **Refund Processing**
   - Automatic refunds on cancellation
   - Partial refund support
   - Refund status tracking

4. **Payment Analytics**
   - Revenue charts
   - Payment trends
   - Worker earnings reports

## Troubleshooting

### Payment Fails
- Check Razorpay keys in .env
- Verify signature generation logic
- Check browser console for errors

### Wallet Not Credited
- Verify payment status is SUCCESS
- Check worker profile in database
- Review transaction logs

### Razorpay Script Not Loading
- Check internet connection
- Verify script tag in index.html
- Check browser console for CSP errors

## Support

For issues related to:
- **Razorpay Integration**: https://razorpay.com/docs
- **Platform Issues**: Check application logs
- **Payment Queries**: Review admin payment dashboard
