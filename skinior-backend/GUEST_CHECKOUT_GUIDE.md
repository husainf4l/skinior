# Guest Checkout System Guide

## Overview

The enhanced checkout system supports both authenticated users and guest customers, with automatic account creation for improved user experience.

## Features

### 1. Guest Checkout

- Customers can place orders without creating an account first
- No authentication required for the checkout process
- Automatic account creation based on email address

### 2. Automatic Account Creation

- When a guest places an order, an account is automatically created
- Uses email as the unique identifier
- No password initially (guest account)
- Customer information is saved for future orders

### 3. Account Linking

- Guest customers can later set a password to fully activate their account
- Preserves order history and customer data
- Seamless transition from guest to registered user

## API Endpoints

### Create Order (Guest Checkout)

```
POST /api/checkout/order
```

**Body:**

```json
{
  "customer": {
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+962791234567"
  },
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "addressLine1": "123 Main Street",
    "city": "Amman",
    "state": "Amman",
    "postalCode": "11181",
    "country": "Jordan", // Accepts "Jordan" or "JO"
    "phone": "+962791234567"
  },
  "billingAddress": {
    // Same as shipping or different
  },
  "items": [
    {
      "productId": "product-id",
      "quantity": 2
      // title and price are automatically fetched from database
    }
  ],
  "shippingMethod": "standard",
  "currency": "JOD",
  "paymentMethod": "stripe"
}
```

**Response:**

```json
{
  "data": {
    "id": "order-id",
    "orderNumber": "SKN-2024-1234",
    "userId": "user-id",
    "customerEmail": "customer@example.com",
    "accountCreated": true,
    "status": "pending",
    "total": 55.98
    // ... other order fields
  }
}
```

### Link Guest Account with Password

```
POST /api/checkout/link-account
```

**Body:**

```json
{
  "email": "customer@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "data": {
    "message": "Password successfully set for your account",
    "email": "customer@example.com"
  }
}
```

### Get Order History

```
GET /api/checkout/order-history?email=customer@example.com
```

**Response:**

```json
{
  "data": {
    "orders": [
      {
        "id": "order-id",
        "orderNumber": "SKN-2024-1234",
        "status": "delivered",
        "total": 55.98,
        "items": [
          // Order items
        ],
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "totalOrders": 1
  }
}
```

## User Flow

### Guest Checkout Flow

1. Customer adds items to cart
2. Proceeds to checkout
3. Fills in customer and shipping information
4. Places order without registration
5. System automatically creates account with email
6. Order is processed normally

### Account Activation Flow

1. Customer receives order confirmation email
2. Email includes link to set password
3. Customer clicks link and sets password
4. Account is fully activated
5. Customer can now login and view order history

## Benefits

### For Customers

- Faster checkout process
- No registration barriers
- Automatic account creation for convenience
- Can upgrade to full account later

### For Business

- Reduced cart abandonment
- Customer data capture
- Future marketing opportunities
- Improved conversion rates

## Technical Implementation

### Database Changes

- `User.password` is optional (nullable)
- `Order.userId` links to user account when created
- Guest orders maintain `customerEmail` for lookup

### Account Creation Logic

1. Check if user exists by email
2. If not, create new user with customer info
3. Link order to user account
4. Return `accountCreated: true` in response

### Product Information Auto-Fetch

- Only `productId` and `quantity` are required in items array
- Product details (title, price, sku) are automatically fetched from database
- Reduces payload size and ensures accurate pricing

### Country Code Support

- Supports both ISO country codes ("JO") and full country names ("Jordan")
- Case-insensitive matching for better user experience
- Cash on Delivery available for Jordan addresses only

### Security Considerations

- Email validation ensures proper format
- Password hashing in production (not implemented in demo)
- Guest accounts have limited access until password is set
- Order data is protected by email verification

## Future Enhancements

### Email Verification

- Send welcome email to new guest accounts
- Include password setup link
- Verify email ownership

### Social Login

- Facebook/Google login integration
- Link social accounts to guest orders
- Streamlined registration process

### Customer Portal

- Order tracking without login
- Email-based order lookup
- Guest order management

## Error Handling

### Common Scenarios

- Duplicate email addresses (existing users)
- Invalid email formats
- Order creation failures
- Account linking errors

### Error Responses

```json
{
  "message": "Error description",
  "statusCode": 400,
  "error": "Bad Request"
}
```

## Testing

### Test Scenarios

1. Guest checkout with new email
2. Guest checkout with existing user email
3. Account linking with valid email
4. Account linking with already-linked account
5. Order history retrieval

### Sample Test Data

```javascript
// Test customer data
const testCustomer = {
  email: 'test@skinior.com',
  firstName: 'Test',
  lastName: 'Customer',
  phone: '+962791234567',
};

// Test order items
const testItems = [
  {
    productId: 'test-product-id',
    title: 'Test Product',
    price: 25.99,
    quantity: 1,
  },
];
```

This guest checkout system provides a seamless shopping experience while capturing valuable customer data for future engagement.
