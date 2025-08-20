# Skinior Checkout API Testing

This file contains sample API calls to test the checkout functionality.

## Prerequisites

- Server running on http://localhost:4008
- Database seeded with discount codes
- Stripe keys configured in .env

## 1. Create a Cart

```bash
curl -X POST http://localhost:4008/api/v1/cart \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "optional-customer-id"
  }'
```

## 2. Add Item to Cart

First, you need a product ID. Get products:

```bash
curl http://localhost:4008/api/products
```

Then add to cart:

```bash
curl -X POST http://localhost:4008/api/v1/cart/{CART_ID}/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

## 3. Get Cart

```bash
curl http://localhost:4008/api/v1/cart/{CART_ID}
```

## 4. Get Available Payment Methods

```bash
curl -X POST http://localhost:4008/api/v1/checkout/payment-methods \
  -H "Content-Type: application/json" \
  -d '{
    "country": "JO"
  }'
```

Response for Jordan:

```json
{
  "data": {
    "country": "JO",
    "paymentMethods": [
      {
        "id": "stripe",
        "name": "Credit/Debit Card",
        "description": "Pay securely with your credit or debit card",
        "fees": "No additional fees",
        "supported": true
      },
      {
        "id": "cod",
        "name": "Cash on Delivery",
        "description": "Pay when your order is delivered",
        "fees": "Additional 2 JOD handling fee",
        "supported": true
      }
    ]
  }
}
```

## 5. Calculate Shipping

```bash
curl -X POST http://localhost:4008/api/v1/checkout/shipping \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "addressLine1": "123 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90210",
      "country": "US"
    }
  }'
```

## 6. Apply Discount Code

```bash
curl -X POST http://localhost:4008/api/v1/checkout/discount \
  -H "Content-Type: application/json" \
  -d '{
    "cartTotal": 100,
    "discountCode": "WELCOME10"
  }'
```

Available discount codes (seeded):

- WELCOME10 (10% off)
- SAVE20 (20% off, min $50)
- FREESHIP ($5 off, min $25)
- NEWUSER25 (25% off, min $100)

## 6. Create Order

```bash
curl -X POST http://localhost:4008/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890"
    },
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "addressLine1": "123 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90210",
      "country": "US",
      "phone": "+1234567890"
    },
    "billingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "addressLine1": "123 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90210",
      "country": "US",
      "phone": "+1234567890"
    },
    "items": [
      {
        "productId": "PRODUCT_ID",
        "title": "Product Name",
        "price": 29.99,
        "quantity": 1
      }
    ],
    "shippingMethod": "standard",
    "currency": "USD"
  }'
```

## 7. Process Payment

First, you need to create a payment method in Stripe. For testing, you can use:

```bash
curl -X POST http://localhost:4008/api/v1/orders/{ORDER_ID}/payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethodId": "pm_card_visa",
    "savePaymentMethod": false
  }'
```

## Test Cards for Stripe

- Success: `4242424242424242`
- Decline: `4000000000000002`
- Requires authentication: `4000002500003155`

## API Endpoints Summary

- `POST /api/v1/cart` - Create cart
- `GET /api/v1/cart/:cartId` - Get cart
- `POST /api/v1/cart/:cartId/items` - Add item to cart
- `PUT /api/v1/cart/:cartId/items/:itemId` - Update cart item
- `DELETE /api/v1/cart/:cartId/items/:itemId` - Remove cart item
- `DELETE /api/v1/cart/:cartId` - Clear cart
- `POST /api/v1/checkout/payment-methods` - Get available payment methods
- `POST /api/v1/checkout/shipping` - Calculate shipping
- `POST /api/v1/checkout/discount` - Apply discount
- `POST /api/v1/orders` - Create order
- `POST /api/v1/orders/:orderId/payment` - Process payment (Stripe or COD)
- `POST /api/webhooks/stripe` - Stripe webhook endpoint

## Environment Variables Required

```env
DATABASE_URL="postgresql://..."
PORT=4008
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (for webhooks)
```

## Notes

1. **Cash on Delivery (COD)** is only available for orders shipped to Jordan (country code: "JO")
2. COD orders have an additional 2 JOD handling fee automatically added to shipping
3. COD orders are automatically confirmed when payment is processed but marked as "cod_pending" for payment status
4. The API uses `/api/v1/` prefix for checkout/cart endpoints
5. All prices are in the currency specified (default JOD for Jordan, USD for others)
6. Tax is calculated at 8% in the cart service
7. Shipping options are currently hardcoded but can be integrated with shipping providers
8. Discount codes are stored in the database and can be managed
9. Payment processing supports both Stripe and Cash on Delivery
10. Webhooks handle Stripe payment confirmation automatically
11. For COD orders, payment collection happens during delivery
