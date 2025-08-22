# Skinior Admin Backend API Documentation

## 🏗️ Overview

The Skinior Admin Backend provides a comprehensive set of RESTful APIs for managing all aspects of the e-commerce platform. Built with NestJS, TypeScript, Prisma ORM, and AWS S3 integration.

**Base URL:** `http://localhost:4008/api/admin`

## 🔐 Authentication

All admin endpoints require JWT authentication with admin role privileges.

### Headers Required:
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

### Admin User Creation:
```bash
npm run create-admin
```

---

## 📦 Products Management

### **GET** `/admin/products`
**Description:** List all products with advanced filtering and pagination

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by title, brand, or SKU
- `category` (optional): Filter by category ID
- `brand` (optional): Filter by brand ID
- `status` (optional): Filter by status (`active`, `inactive`, `all`)
- `featured` (optional): Filter featured products (boolean)
- `inStock` (optional): Filter by stock availability (boolean)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Products retrieved successfully",
  "timestamp": "2025-08-22T14:07:59.000Z"
}
```

### **GET** `/admin/products/:id`
**Description:** Get detailed product information including analytics

**Response:** Detailed product object with analytics, parsed JSON fields, and relationships

### **POST** `/admin/products`
**Description:** Create a new product

**Request Body:**
```json
{
  "title": "Vitamin C Serum",
  "titleAr": "سيروم فيتامين سي",
  "descriptionEn": "Brightening vitamin C serum...",
  "descriptionAr": "سيروم فيتامين سي المضيء...",
  "price": 45.99,
  "compareAtPrice": 59.99,
  "currency": "JOD",
  "sku": "VCS001",
  "isActive": true,
  "isFeatured": false,
  "stockQuantity": 100,
  "categoryId": "uuid-category-id",
  "brandId": "uuid-brand-id",
  "activeIngredients": "25% Vitamin C, Hyaluronic Acid",
  "skinType": "All skin types",
  "features": ["Brightening", "Anti-aging", "Hydrating"],
  "concerns": ["Dark spots", "Dullness", "Fine lines"]
}
```

### **PUT** `/admin/products/:id`
**Description:** Update existing product (same body as POST, all fields optional)

### **DELETE** `/admin/products/:id`
**Description:** Delete product and associated S3 images

### **POST** `/admin/products/:id/images/upload`
**Description:** Upload multiple product images to AWS S3

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `images`: Multiple image files (max 10)
- `altTexts[]`: Alt text for each image
- `isMain[]`: Boolean array indicating main images

### **POST** `/admin/products/:id/images/:imageId/main`
**Description:** Set a specific image as the main product image

### **DELETE** `/admin/products/:id/images/:imageId`
**Description:** Delete specific product image from database and S3

### **POST** `/admin/products/presigned-upload`
**Description:** Generate presigned URL for client-side S3 uploads

**Request Body:**
```json
{
  "fileName": "product-image.jpg",
  "contentType": "image/jpeg"
}
```

### **POST** `/admin/products/bulk-action`
**Description:** Perform bulk operations on multiple products

**Request Body:**
```json
{
  "productIds": ["uuid1", "uuid2", "uuid3"],
  "action": "activate|deactivate|delete|updateCategory|updateBrand",
  "value": "category-or-brand-id" // Required for updateCategory/updateBrand
}
```

### **GET** `/admin/products/analytics/overview`
**Description:** Get comprehensive product analytics

---

## 📂 Categories Management

### **GET** `/admin/categories`
**Description:** List all categories with hierarchical structure

**Query Parameters:**
- `includeProducts` (optional): Include product counts and details

**Response:** Hierarchical category tree with parent-child relationships

### **GET** `/admin/categories/:id`
**Description:** Get detailed category information including products

### **POST** `/admin/categories`
**Description:** Create new category

**Request Body:**
```json
{
  "nameEn": "Skincare",
  "name": "Skincare", // Fallback name
  "nameAr": "العناية بالبشرة",
  "descriptionEn": "Complete skincare solutions",
  "descriptionAr": "حلول شاملة للعناية بالبشرة",
  "parentId": "uuid-parent-category" // Optional for subcategories
}
```

### **PUT** `/admin/categories/:id`
**Description:** Update category (prevents circular references)

### **DELETE** `/admin/categories/:id`
**Description:** Delete category (reassigns child categories and products)

### **GET** `/admin/categories/analytics/overview`
**Description:** Get category performance analytics

---

## 🏷️ Brands Management

### **GET** `/admin/brands`
**Description:** List all brands with product counts

### **GET** `/admin/brands/:id`
**Description:** Get detailed brand information and products

### **POST** `/admin/brands`
**Description:** Create new brand

**Request Body:**
```json
{
  "name": "The Ordinary",
  "nameAr": "ذي أورديناري",
  "description": "Clinical formulations with integrity",
  "descriptionAr": "تركيبات سريرية بصدق",
  "website": "https://theordinary.com",
  "isActive": true
}
```

### **PUT** `/admin/brands/:id`
**Description:** Update brand information

### **DELETE** `/admin/brands/:id`
**Description:** Delete brand (reassigns products, deletes S3 logo)

### **POST** `/admin/brands/:id/logo`
**Description:** Upload brand logo to S3

**Content-Type:** `multipart/form-data`
**Form Field:** `logo` (single image file)

### **DELETE** `/admin/brands/:id/logo`
**Description:** Delete brand logo from S3

### **GET** `/admin/brands/analytics/overview`
**Description:** Get brand performance analytics

---

## 👥 Users Management

### **GET** `/admin/users`
**Description:** List all users with filtering

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search by name or email
- `role`: Filter by role (`customer`, `admin`, `agent`, `all`)
- `status`: Filter by status (`active`, `inactive`, `all`)

### **GET** `/admin/users/:id`
**Description:** Get detailed user info with order history and analytics

### **POST** `/admin/users`
**Description:** Create new user

**Request Body:**
```json
{
  "email": "admin@skinior.com",
  "password": "securePassword123", // Optional
  "firstName": "Admin",
  "lastName": "User",
  "phone": "+962791234567",
  "role": "admin", // customer|admin|agent
  "isActive": true,
  "isSystem": false
}
```

### **PUT** `/admin/users/:id`
**Description:** Update user information (password optional)

### **DELETE** `/admin/users/:id`
**Description:** Soft delete user (deactivates account)

### **GET** `/admin/users/analytics/overview`
**Description:** Get user analytics, acquisition trends, and growth metrics

---

## 📋 Orders Management

### **GET** `/admin/orders`
**Description:** List all orders with filtering

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search by order number, customer name, or email
- `status`: Filter by order status (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`, `all`)
- `paymentStatus`: Filter by payment status (`pending`, `paid`, `failed`, `cod_pending`, `all`)

### **GET** `/admin/orders/:id`
**Description:** Get detailed order information with items and analytics

### **PUT** `/admin/orders/:id`
**Description:** Update order status and information

**Request Body:**
```json
{
  "status": "shipped",
  "paymentStatus": "paid",
  "shippingAddress": "Updated address",
  "shippingCity": "Amman",
  "shippingPhone": "+962791234567",
  "codNotes": "Call before delivery",
  "shipping": 5.00,
  "tax": 2.50
}
```

### **GET** `/admin/orders/analytics/overview`
**Description:** Get comprehensive order analytics, revenue metrics, and trends

---

## 📊 Analytics Dashboard

### **GET** `/admin/analytics/dashboard`
**Description:** Get comprehensive dashboard overview

**Response:** Complete dashboard metrics including:
- Product statistics (total, active, low stock)
- Order metrics (total, pending, today's orders)
- Revenue data (total, monthly, today)
- User statistics (total, active, new this month)
- Recent activity (orders, products)

### **GET** `/admin/analytics/revenue?period=30d`
**Description:** Get detailed revenue analytics

**Query Parameters:**
- `period`: Analytics period (`7d`, `30d`, `90d`, `1y`)

**Response:** Revenue trends, growth calculations, daily breakdown, and payment method analysis

### **GET** `/admin/analytics/products/performance?limit=20`
**Description:** Get product performance metrics

**Query Parameters:**
- `limit`: Number of top products to return

**Response:** Top-selling products, revenue generators, low performers, and category performance

### **GET** `/admin/analytics/customers`
**Description:** Get customer behavior analytics

**Response:** Customer acquisition, retention metrics, top customers, and growth trends

### **GET** `/admin/analytics/inventory`
**Description:** Get inventory status and alerts

**Response:** Stock distribution, low stock alerts, out of stock products, and inventory value

---

## 🔧 Technical Specifications

### **AWS S3 Integration**
- **Supported Formats:** JPEG, PNG, WebP, GIF
- **File Size Limit:** 10MB per file
- **Storage Structure:**
  - Products: `products/uuid.extension`
  - Brands: `brands/uuid.extension`
  - Categories: `categories/uuid.extension`
- **Features:**
  - Automatic file cleanup on deletion
  - Presigned URLs for client uploads
  - Optimized cache headers
  - Secure credential handling

### **Authentication & Security**
- **JWT Authentication:** Required for all endpoints
- **Role-Based Access:** Admin role verification
- **Rate Limiting:** Inherited from main application
- **Input Validation:** Comprehensive using class-validator
- **Error Handling:** Consistent error responses with proper HTTP status codes

### **Database Design**
- **ORM:** Prisma with PostgreSQL
- **Relationships:** Proper foreign keys and cascading
- **Indexing:** Optimized for query performance
- **Transactions:** Used for complex operations
- **Soft Deletes:** For users and sensitive data

### **API Response Format**
All endpoints return consistent JSON responses:

```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "timestamp": string
}
```

### **Error Response Format**
```json
{
  "success": false,
  "error": {
    "message": "Detailed error message",
    "statusCode": 400,
    "timestamp": "2025-08-22T14:07:59.000Z"
  }
}
```

## 🚀 Getting Started

1. **Ensure Admin User Exists:**
   ```bash
   npm run create-admin
   ```

2. **Authenticate:**
   ```bash
   curl -X POST http://localhost:4008/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password"}'
   ```

3. **Use JWT Token:**
   ```bash
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:4008/api/admin/analytics/dashboard
   ```

4. **Upload Images:**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -F "images=@product1.jpg" \
     -F "images=@product2.jpg" \
     -F "altTexts[]=Main product image" \
     -F "altTexts[]=Secondary view" \
     -F "isMain[]=true" \
     -F "isMain[]=false" \
     http://localhost:4008/api/admin/products/PRODUCT_ID/images/upload
   ```

## 📝 Notes

- All endpoints include comprehensive Swagger documentation
- Pagination defaults to 20 items per page (max 100)
- File uploads are validated for type and size
- Bulk operations provide detailed success/failure reports
- Analytics data is calculated in real-time
- All dates are returned in ISO 8601 format
- Currency amounts are in the configured currency (default: JOD)
- Arabic content is fully supported throughout the system

## 🔗 Related Documentation

- [Main API Documentation](./API_DOCUMENTATION.md)
- [Authentication Guide](./AUTHENTICATION_GUIDE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [AWS S3 Setup Guide](./AWS_S3_SETUP.md)