# 💳 Razorpay Integration Setup Guide

## Current Status
✅ Razorpay is **fully integrated** in Urban-Skill!
- Backend payment controller implemented
- Frontend payment modal with Razorpay checkout
- Payment verification system
- Secure webhook handling
- Test keys are currently configured

## 🚀 How to Get Real Razorpay Keys

### Step 1: Create Razorpay Account
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. Sign up with your email and business details
3. Complete KYC verification (required for live mode)

### Step 2: Get API Keys

#### For Testing (Current Setup)
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Click on **Generate Test Key**
4. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this secure!)

#### For Production
1. Complete KYC verification
2. Get approval from Razorpay
3. Go to **Settings** → **API Keys**
4. Switch to **Live** mode
5. Generate Live Keys:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

### Step 3: Update Environment Variables

#### Backend (.env)
```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
```

#### Frontend (.env)
```env
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXX
```

### Step 4: Restart Servers
```bash
# Backend
cd backend
npm run dev

# Frontend (in new terminal)
cd frontend
npm run dev
```

## 📋 Payment Flow

### 1. Customer Side
1. Customer logs in
2. Browses workers and creates a booking
3. Worker accepts the booking
4. **Pay Now** button appears in booking details
5. Click **Pay Now** → Razorpay checkout modal opens
6. Enter card details (use test cards for testing)
7. Payment is processed
8. Booking status updates to PAID

### 2. Worker Side
1. Worker receives booking request
2. Worker accepts the booking
3. After customer pays, booking status updates
4. Worker can start the service
5. Amount is credited to worker's wallet after service completion

## 🧪 Test Cards (For Test Mode)

### Successful Payments
- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

### Failed Payments (For testing error handling)
- **Card Number:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### More Test Cards
Visit: [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

## 🔐 Security Features Implemented

✅ **Payment Signature Verification** - Ensures payment authenticity
✅ **Webhook Signature Validation** - Prevents tampering
✅ **HTTPS Required** - Secure data transmission (for production)
✅ **Database Transaction** - Atomic payment recording
✅ **Idempotency** - Prevents duplicate payments

## 📊 Payment Status Flow

```
PENDING → PROCESSING → SUCCESS → COMPLETED
                     ↓
                   FAILED → REFUND_INITIATED → REFUNDED
```

## 🛠️ Implemented Features

### Payment Controller (`backend/src/controllers/paymentController.js`)
- ✅ Create Razorpay order
- ✅ Verify payment signature
- ✅ Get payment details
- ✅ Process refunds
- ✅ Handle webhooks

### Payment Service (`backend/src/services/paymentService.js`)
- ✅ Order creation logic
- ✅ Payment verification
- ✅ Booking status updates
- ✅ Worker wallet credit

### Payment Modal (`frontend/src/components/booking/PaymentModal.jsx`)
- ✅ Razorpay checkout integration
- ✅ Dynamic amount calculation
- ✅ Customer prefill
- ✅ Payment success/failure handling

## 🧪 Testing the Payment Flow

### Test Scenario 1: Successful Payment
1. Login as customer (priya.patel@example.com)
2. Create a booking with a worker
3. Login as worker and accept the booking
4. Login back as customer
5. Go to booking details
6. Click **Pay Now**
7. Use test card: 4111 1111 1111 1111
8. Complete payment
9. Verify booking status changes to PAID

### Test Scenario 2: Payment Failure
1. Follow steps 1-6 above
2. Use failed card: 4000 0000 0000 0002
3. Payment should fail gracefully
4. User can retry payment

## 🚀 Going Live Checklist

- [ ] Complete Razorpay KYC
- [ ] Get live API keys
- [ ] Update both backend and frontend .env files
- [ ] Test with real cards in staging
- [ ] Enable webhook URL in Razorpay dashboard
- [ ] Set up webhook endpoint: `https://yourdomain.com/api/payments/webhook`
- [ ] Add webhook secret to .env
- [ ] Enable HTTPS on your domain
- [ ] Test complete payment flow
- [ ] Monitor payment logs

## 💡 Additional Features You Can Add

### 1. Partial Payments
```javascript
// In PaymentModal.jsx
const handlePartialPayment = (percentage) => {
  const partialAmount = (booking.totalAmount * percentage) / 100;
  // Process partial payment
};
```

### 2. Payment History
```javascript
// New component: PaymentHistory.jsx
const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  // Fetch and display all user payments
};
```

### 3. Refund Tracking
```javascript
// In BookingDetails.jsx
const handleRefundRequest = () => {
  // Request refund for cancelled booking
};
```

### 4. Multiple Payment Methods
- UPI
- Net Banking
- Wallets (Paytm, PhonePe, etc.)
- EMI options

## 📞 Support

### Razorpay Support
- Documentation: https://razorpay.com/docs/
- Support: support@razorpay.com
- Community: https://community.razorpay.com/

### Common Issues

**Issue:** Payment modal not opening
- **Solution:** Check if Razorpay script is loaded (check browser console)
- Verify `VITE_RAZORPAY_KEY_ID` is set correctly

**Issue:** Payment verification fails
- **Solution:** Check webhook signature verification
- Ensure correct key secret is used

**Issue:** Amount mismatch
- **Solution:** Verify amount is in paise (multiply by 100)
- Check totalAmount calculation in booking

## 🎯 Next Steps

1. **Get Real Razorpay Keys:**
   - Create Razorpay account
   - Generate test keys first
   - Replace keys in both .env files

2. **Test Payment Flow:**
   - Create a booking
   - Process test payment
   - Verify status updates

3. **Go Live:**
   - Complete KYC
   - Get live keys
   - Deploy with HTTPS
   - Enable webhooks

---

## 📝 Current Implementation Status

| Feature | Status | Location |
|---------|--------|----------|
| Payment Controller | ✅ Complete | `backend/src/controllers/paymentController.js` |
| Payment Service | ✅ Complete | `backend/src/services/paymentService.js` |
| Payment Routes | ✅ Complete | `backend/src/routes/paymentRoutes.js` |
| Payment Model | ✅ Complete | `backend/src/models/Payment.js` |
| Payment Modal | ✅ Complete | `frontend/src/components/booking/PaymentModal.jsx` |
| Razorpay Config | ✅ Complete | `backend/src/config/razorpay.js` |
| Environment Setup | ⚠️ Test Keys | `.env` files |

**Status:** 🟢 **Fully Functional with Test Keys**

Replace test keys with real ones to go live! 🚀
