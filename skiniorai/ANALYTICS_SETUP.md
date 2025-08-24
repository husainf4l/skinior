# 📊 Analytics & Monitoring Setup Guide

## ✅ **What's Been Implemented**

### 1. **Google Analytics 4 Enhanced Tracking**
- ✅ Comprehensive e-commerce tracking (purchase, add_to_cart, view_item)
- ✅ Custom conversion events (sign_up, newsletter, skin_analysis)
- ✅ Enhanced debugging in development mode
- ✅ Automatic page view tracking
- ✅ Form submission tracking

### 2. **Error Handling**
- ✅ Error boundary component for graceful error handling
- ✅ Console logging in development mode
- ✅ User-friendly error messages

### 3. **Enhanced Core Web Vitals Monitoring**
- ✅ Real-time FCP, LCP, CLS, FID, TTFB measurement
- ✅ Google's official rating system (good/needs-improvement/poor)
- ✅ Automatic GA4 reporting with ratings
- ✅ Console logging with emojis for easy debugging

### 4. **Analytics Dashboard Component**
- ✅ Real-time performance metrics display
- ✅ Key conversion tracking
- ✅ Device type analytics
- ✅ Data export functionality

## 🚀 **Setup Instructions**

### Step 1: Get Your Google Analytics ID

#### **Google Analytics 4:**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a new GA4 property for your website
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required variables:**
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR-MEASUREMENT-ID
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Step 3: Use Analytics Hooks in Components

```tsx
import { useAnalytics } from '@/components/analytics/GoogleAnalytics';

function YourComponent() {
  const analytics = useAnalytics();

  const handlePurchase = () => {
    analytics.trackPurchase('order-123', 99.99, 'JOD', [
      { item_id: 'product-1', item_name: 'Serum', item_category: 'skincare', quantity: 1, price: 99.99 }
    ]);
  };

  const handleSignUp = () => {
    analytics.trackSignUp('email');
  };

  return (
    <div>
      <button onClick={handlePurchase}>Complete Purchase</button>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
```

## 📈 **Available Tracking Methods**

### **E-commerce Events:**
- `trackPurchase(transactionId, value, currency, items)`
- `trackProductView(productId, productName, price)`  
- `trackAddToCart(productId, productName, price, quantity)`

### **Conversion Events:**
- `trackSignUp(method)`
- `trackLogin(method)`
- `trackNewsletterSubscription()`
- `trackSkinAnalysis(analysisType)`

### **General Events:**
- `trackEvent(eventName, parameters)`
- `trackSearch(searchTerm)`
- `trackFormSubmission(formName, success)`
- `trackFileDownload(fileName, fileType)`
- `trackSocialShare(platform, content)`

### **Error Handling:**
```tsx
import ErrorBoundary from '@/components/analytics/ErrorBoundary';

// Wrap components that might error
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## 🎯 **Core Web Vitals Monitoring**

Performance metrics are automatically tracked and sent to GA4:
- **FCP**: First Contentful Paint
- **LCP**: Largest Contentful Paint  
- **CLS**: Cumulative Layout Shift
- **FID**: First Input Delay
- **TTFB**: Time to First Byte

Each metric includes:
- Actual value
- Google's rating (good/needs-improvement/poor)
- Automatic console logging in development

## 📊 **Analytics Dashboard**

Access the dashboard component:
```tsx
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

<AnalyticsDashboard />
```

Features:
- Real-time metrics display
- Performance ratings with color coding
- Data export functionality
- Mobile-responsive design

## 🔧 **Testing & Debugging**

### Development Mode:
- Analytics events are logged to console with 🔍 prefix
- Performance metrics show with emoji indicators
- Error boundary shows detailed error info
- Comprehensive console logging

### Production Mode:
- Clean analytics reporting
- Performance monitoring optimized
- User-friendly error messages
- No debug console output

## 🚨 **Important Notes**

1. **Privacy**: Analytics only run in production by default
2. **Performance**: Minimal impact on Core Web Vitals
3. **GDPR**: Consider adding cookie consent for GA4
4. **Testing**: Use Google Analytics DebugView for real-time testing

## 📋 **Next Steps**

1. Set up your GA4 account
2. Add environment variables
3. Deploy and test analytics
4. Monitor Core Web Vitals in GA4
5. Set up GA4 conversion goals

Need help with setup? Check the console logs in development mode to see if analytics are firing correctly!