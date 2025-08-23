export interface DashboardStats {
  summary: {
    products: {
      total: number;
      active: number;
      lowStock: number;
    };
    orders: {
      total: number;
      pending: number;
      today: number;
    };
    revenue: {
      total: number;
      monthly: number;
      today: number;
    };
    users: {
      total: number;
      active: number;
      newThisMonth: number;
    };
    catalog: {
      categories: number;
      brands: number;
    };
  };
  recentActivity: {
    orders: Order[];
    products: Product[];
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cod_pending';
  paymentMethod: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  currency: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPhone?: string;
  codNotes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  analytics?: {
    totalItems: number;
    itemCount: number;
  };
}

export interface OrderItem {
  id: string;
  productId?: string;
  title: string;
  sku?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Product {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  categoryId: string;
  brandId: string;
  images: ProductImage[];
  category?: Category;
  brand?: Brand;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isMain: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}