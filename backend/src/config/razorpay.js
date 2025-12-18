const Razorpay = require('razorpay');
const { envConfig } = require('./env');

const razorpayInstance = new Razorpay({
  key_id: envConfig.razorpayKeyId,
  key_secret: envConfig.razorpayKeySecret,
});

const getRazorpayInstance = () => razorpayInstance;

module.exports = {
  razorpayInstance,
  getRazorpayInstance,
};
