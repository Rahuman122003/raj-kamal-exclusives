// ============================================
// RAZORPAY CONFIGURATION
// ============================================
// To use Razorpay payments:
// 1. Create a Razorpay account at https://razorpay.com
// 2. Go to Settings > API Keys in your Razorpay Dashboard
// 3. Generate a Test Key (for testing) or Live Key (for production)
// 4. Replace the key below with YOUR Razorpay Key ID
//
// Test Key starts with: rzp_test_
// Live Key starts with: rzp_live_
// ============================================

export const RAZORPAY_KEY_ID = 'rzp_test_SXm5EU9OBDloLk';

// Shop details shown in Razorpay checkout popup
export const RAZORPAY_CONFIG = {
  name: 'Raj Kamal Exclusives',
  description: 'Premium Textile Shopping',
  currency: 'INR',
  // Replace with your logo URL for Razorpay popup
  image: '',
  theme: {
    color: '#5C3A1E', // matches your brand chocolate color
  },
};
