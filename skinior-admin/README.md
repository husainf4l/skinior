# Skinior Admin Dashboard

A modern, responsive admin dashboard for managing products built with Angular 18, Angular Material, and TypeScript.

## ✨ Features

- **Modern UI**: Clean, professional design with Angular Material components
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Product Management**: Full CRUD operations for products
- **Advanced Search & Filtering**: Search by name, description, SKU, and filter by categories
- **Image Management**: Support for multiple product images with main/hover image selection
- **Real-time Updates**: Automatic refresh after CRUD operations
- **Pagination**: Handle large product catalogs efficiently
- **Professional Dashboard**: Grid and card views with detailed product information

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 18+

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd skinior-admin
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## 🔧 Configuration

### Backend API Configuration

The application is configured to connect to your backend API at `http://localhost:4008/api/products`.

Update the API URL in `src/app/services/product.service.ts`:

```typescript
private readonly apiUrl = 'http://localhost:4008/api/products';
```

### Expected Backend API Endpoints

The application expects the following REST API endpoints:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 📋 Product Data Structure

The application works with the following product data structure based on your backend DTO:

```typescript
interface Product {
  id: string;
  title: string;
  titleAr?: string;
  slug?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;

  // Skincare specific fields
  activeIngredients?: string;
  skinType?: string;
  concerns?: string[];
  usage?: string;
  features?: string[];
  ingredients?: string[];
  howToUse?: string[];

  // Localization
  featuresAr?: string;
  ingredientsAr?: string;
  howToUseAr?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Inventory
  stockQuantity?: number;
  viewCount?: number;
  salesCount?: number;

  // Relations
  categoryId?: string;
  brandId?: string;

  // Images
  images?: ProductImage[];

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductImage {
  url: string;
  altText?: string;
  isMain?: boolean;
  isHover?: boolean;
  sortOrder?: number;
}
```

## 🎨 Sample Data

Here's sample product data you can use for testing:

```json
{
  "id": "prod_001",
  "title": "Vitamin C Brightening Serum",
  "titleAr": "سيروم فيتامين سي المشرق",
  "slug": "vitamin-c-brightening-serum",
  "descriptionEn": "A powerful antioxidant serum that brightens skin and reduces signs of aging with 20% Vitamin C complex.",
  "descriptionAr": "سيروم قوي مضاد للأكسدة يضيء البشرة ويقلل علامات الشيخوخة بمركب فيتامين سي 20%",
  "price": 89.99,
  "compareAtPrice": 119.99,
  "currency": "USD",
  "sku": "VCS-001",
  "isActive": true,
  "isFeatured": true,
  "isNew": false,
  "activeIngredients": "20% L-Ascorbic Acid, Vitamin E, Hyaluronic Acid",
  "skinType": "All skin types",
  "concerns": ["Dark spots", "Fine lines", "Dull skin", "Uneven tone"],
  "usage": "Morning and evening",
  "features": [
    "20% stable Vitamin C",
    "Brightens complexion",
    "Reduces fine lines",
    "Antioxidant protection"
  ],
  "ingredients": [
    "Water",
    "L-Ascorbic Acid",
    "Propylene Glycol",
    "Triethanolamine",
    "Alpha Tocopherol",
    "Sodium Hyaluronate"
  ],
  "howToUse": [
    "Cleanse face thoroughly",
    "Apply 3-4 drops to face and neck",
    "Gently pat until absorbed",
    "Follow with moisturizer",
    "Use SPF during daytime"
  ],
  "metaTitle": "Vitamin C Brightening Serum - Skinior",
  "metaDescription": "Transform your skin with our powerful 20% Vitamin C serum. Brighten, protect, and rejuvenate for radiant, youthful skin.",
  "stockQuantity": 150,
  "viewCount": 1250,
  "salesCount": 89,
  "categoryId": "serums",
  "brandId": "skinior",
  "images": [
    {
      "url": "https://example.com/images/vitamin-c-serum-main.jpg",
      "altText": "Vitamin C Brightening Serum - Main Product Image",
      "isMain": true,
      "isHover": false,
      "sortOrder": 1
    },
    {
      "url": "https://example.com/images/vitamin-c-serum-hover.jpg",
      "altText": "Vitamin C Brightening Serum - Usage Image",
      "isMain": false,
      "isHover": true,
      "sortOrder": 2
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

## 🛠️ Development

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── product-list/          # Product listing with search & filters
│   │   ├── product-form/          # Add/Edit product form
│   │   └── product-form-advanced/ # Advanced form with all fields
│   ├── interfaces/
│   │   └── product.interface.ts   # TypeScript interfaces
│   ├── services/
│   │   └── product.service.ts     # API service
│   ├── app.component.ts           # Root component
│   ├── app.config.ts             # App configuration
│   └── app.routes.ts             # Routing configuration
├── assets/
│   └── images/
│       └── no-image.svg          # Placeholder image
└── styles.css                   # Global styles
```

## 📱 Current Implementation

The current implementation includes:

✅ **Product List Component**:

- Grid view of products with professional cards
- Search functionality (by title, description, SKU)
- Filtering (All, Featured, Low Stock)
- Pagination with customizable page sizes
- Product badges (Featured, New, Stock status)
- Responsive design

✅ **Product Form Component**:

- Add/Edit products with basic fields
- Form validation
- Image URL support with preview
- Data transformation for API compatibility

✅ **API Integration**:

- Service layer with HTTP client
- Observable-based data flow
- Error handling and loading states
- Configured for localhost:4008/api

## 🚀 Usage

1. **View Products**: Navigate to the main page to see all products in a grid layout
2. **Search Products**: Use the search bar to find products by name, description, or SKU
3. **Filter Products**: Click on filter chips to show Featured or Low Stock items
4. **Add Product**: Click "Add New Product" button and fill in the form
5. **Edit Product**: Click "Edit" button on any product card
6. **Delete Product**: Click "Delete" button with confirmation dialog

## 🔧 API Integration

Make sure your backend API at `http://localhost:4008/api` returns data in the expected format. The frontend will transform simple form data to match your comprehensive DTO structure when creating/updating products.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Angular 18 and Angular Material
