# Skinior AI Frontend Requirements

## Overview

This document outlines the frontend requirements for the Skinior AI e-commerce platform using Next.js 15 with App Router, following modern React patterns and best practices.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Payment Integration](#payment-integration)
- [Internationalization](#internationalization)
- [Performance Optimization](#performance-optimization)
- [Implementation Steps](#implementation-steps)

## Tech Stack

### Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI / Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand + React Context
- **HTTP Client**: Native fetch with custom hooks
- **Internationalization**: next-intl
- **Payment**: Stripe + Custom COD implementation
- **Image Optimization**: Next.js Image component

### Development Tools

- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest + React Testing Library
- **Development**: Next.js dev server with Hot Reload

## Project Structure

```
src/
├── app/                          # App Router directory
│   ├── [locale]/                 # Internationalization
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   ├── products/             # Product pages
│   │   │   ├── page.tsx          # Product listing
│   │   │   └── [id]/             # Product detail
│   │   │       └── page.tsx
│   │   ├── cart/                 # Cart page
│   │   │   └── page.tsx
│   │   ├── checkout/             # Checkout flow
│   │   │   ├── page.tsx          # Checkout summary
│   │   │   ├── shipping/         # Shipping details
│   │   │   └── payment/          # Payment processing
│   │   ├── account/              # Customer account
│   │   │   ├── page.tsx          # Account dashboard
│   │   │   ├── orders/           # Order history
│   │   │   └── profile/          # Profile management
│   │   └── auth/                 # Authentication
│   │       ├── login/
│   │       └── register/
│   ├── api/                      # API routes (for frontend only operations)
│   │   ├── cart/                 # Cart session management
│   │   └── webhooks/             # Payment webhooks
│   ├── globals.css               # Global styles
│   └── not-found.tsx             # 404 page
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── navigation.tsx
│   ├── product/                  # Product-related components
│   │   ├── product-card.tsx
│   │   ├── product-gallery.tsx
│   │   ├── add-to-cart.tsx
│   │   └── product-filters.tsx
│   ├── cart/                     # Cart components
│   │   ├── cart-drawer.tsx
│   │   ├── cart-item.tsx
│   │   └── cart-summary.tsx
│   ├── checkout/                 # Checkout components
│   │   ├── checkout-form.tsx
│   │   ├── payment-methods.tsx
│   │   ├── shipping-form.tsx
│   │   └── order-summary.tsx
│   └── common/                   # Common components
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       └── seo-head.tsx
├── lib/                          # Utility libraries
│   ├── api/                      # API client functions
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   └── customers.ts
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-cart.ts
│   │   ├── use-products.ts
│   │   └── use-checkout.ts
│   ├── store/                    # State management
│   │   ├── cart-store.ts
│   │   ├── user-store.ts
│   │   └── ui-store.ts
│   ├── utils/                    # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   └── types/                    # TypeScript type definitions
│       ├── product.ts
│       ├── cart.ts
│       ├── order.ts
│       └── customer.ts
├── styles/                       # Additional styles
│   └── components.css
├── messages/                     # Internationalization
│   ├── en.json
│   └── ar.json
└── middleware.ts                 # Next.js middleware
```

## Core Features

### 1. Product Catalog

- **Product Listing**: Grid/list view with filters and sorting
- **Product Search**: Real-time search with autocomplete
- **Product Details**: Image gallery, variants, reviews, recommendations
- **Categories**: Hierarchical category navigation
- **Filters**: Price, skin type, concerns, ingredients

### 2. Shopping Cart

- **Add to Cart**: Quick add with variants selection
- **Cart Management**: Update quantities, remove items
- **Cart Persistence**: Local storage + server sync
- **Cart Drawer**: Slide-out cart overlay
- **Inventory Validation**: Real-time stock checking

### 3. Checkout Process

- **Guest Checkout**: No account required
- **Multi-step Form**: Shipping, payment, review
- **Address Management**: Save multiple addresses
- **Shipping Options**: Standard and express delivery
- **Payment Methods**: Stripe + Cash on Delivery
- **Order Confirmation**: Email + SMS notifications

### 4. User Account

- **Authentication**: Email/password + social login
- **Profile Management**: Personal info, skin profile
- **Order History**: Track orders, reorder functionality
- **Address Book**: Manage shipping addresses
- **Wishlist**: Save products for later

### 5. Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablets
- **Desktop**: Full-featured desktop experience
- **Touch-friendly**: Large tap targets, swipe gestures

## Component Architecture

### Base UI Components

#### Button Component

```typescript
// components/ui/button.tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size])}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
```

#### Input Component

```typescript
// components/ui/input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({
  label,
  error,
  helper,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none">{label}</label>
      )}
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helper && !error && (
        <p className="text-sm text-muted-foreground">{helper}</p>
      )}
    </div>
  );
}
```

### Product Components

#### Product Card

```typescript
// components/product/product-card.tsx
interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: product.variants[0].id,
      quantity: 1,
    });
  };

  if (variant === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={product.images[0]?.url}
            alt={product.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="font-bold">
                ${(product.price / 100).toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${(product.compareAtPrice / 100).toFixed(2)}
                </span>
              )}
            </div>
            <Button size="sm" onClick={handleAddToCart} loading={isLoading}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative border rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={product.images[0]?.url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
        {product.compareAtPrice && (
          <div className="absolute top-2 left-2 bg-destructive text-white px-2 py-1 rounded text-xs">
            Sale
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">
              ${(product.price / 100).toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${(product.compareAtPrice / 100).toFixed(2)}
              </span>
            )}
          </div>
          <Button size="sm" onClick={handleAddToCart} loading={isLoading}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
```

#### Add to Cart Component

```typescript
// components/product/add-to-cart.tsx
interface AddToCartProps {
  product: Product;
  selectedVariant?: ProductVariant;
}

export function AddToCart({ product, selectedVariant }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(
    selectedVariant?.id || product.variants[0]?.id
  );

  const { addToCart, isLoading } = useCart();
  const variant = product.variants.find((v) => v.id === selectedVariantId);

  const handleAddToCart = async () => {
    if (!variant) return;

    try {
      await addToCart({
        productId: product.id,
        variantId: variant.id,
        quantity,
      });

      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const isOutOfStock = !variant?.available || variant.inventoryCount === 0;
  const isLowStock = variant?.inventoryCount && variant.inventoryCount < 10;

  return (
    <div className="space-y-4">
      {/* Variant Selection */}
      {product.variants.length > 1 && (
        <div>
          <label className="text-sm font-medium">Size</label>
          <div className="flex gap-2 mt-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                className={cn(
                  "px-3 py-2 border rounded text-sm",
                  selectedVariantId === variant.id
                    ? "border-primary bg-primary text-white"
                    : "border-input hover:border-primary",
                  !variant.available && "opacity-50 cursor-not-allowed"
                )}
                disabled={!variant.available}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selection */}
      <div>
        <label className="text-sm font-medium">Quantity</label>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
            disabled={variant && quantity >= variant.inventoryCount}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {isLowStock && (
          <p className="text-sm text-orange-500 mt-1">
            Only {variant?.inventoryCount} left in stock
          </p>
        )}
      </div>

      {/* Add to Cart Button */}
      <Button
        className="w-full"
        onClick={handleAddToCart}
        disabled={isOutOfStock || isLoading}
        loading={isLoading}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>

      {/* Stock Status */}
      {isOutOfStock && (
        <p className="text-sm text-destructive">
          This item is currently out of stock
        </p>
      )}
    </div>
  );
}
```

### Cart Components

#### Cart Drawer

```typescript
// components/cart/cart-drawer.tsx
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeItem, updateQuantity, isLoading } = useCart();
  const { t } = useTranslations("cart");

  const subtotal =
    cart?.items.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>
            {cart?.items.length || 0} {t("itemsInCart")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {cart?.items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">{t("emptyCart")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart?.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(quantity) =>
                      updateQuantity(item.id, quantity)
                    }
                    onRemove={() => removeItem(item.id)}
                    loading={isLoading}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart?.items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>{t("subtotal")}</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/checkout">{t("proceedToCheckout")}</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/cart">{t("viewCart")}</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

#### Cart Item Component

```typescript
// components/cart/cart-item.tsx
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  loading?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  loading = false,
}: CartItemProps) {
  return (
    <div className="flex gap-3">
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{item.product.name}</h4>
        <p className="text-sm text-muted-foreground">{item.variant.name}</p>
        <p className="text-sm font-medium">
          ${(item.unitPrice / 100).toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <Button variant="ghost" size="sm" onClick={onRemove} disabled={loading}>
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1 || loading}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={loading}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## State Management

### Cart Store (Zustand)

```typescript
// lib/store/cart-store.ts
interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (item: AddToCartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  addToCart: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const cartId = get().cart?.id || (await createCart());
      const updatedCart = await addToCartAPI(cartId, item);
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const cartId = get().cart?.id;
      if (!cartId) return;

      const updatedCart = await removeCartItemAPI(cartId, itemId);
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const cartId = get().cart?.id;
      if (!cartId) return;

      const updatedCart = await updateCartItemAPI(cartId, itemId, { quantity });
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cartId = get().cart?.id;
      if (!cartId) return;

      await clearCartAPI(cartId);
      set({ cart: null, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        set({ isLoading: false });
        return;
      }

      const cart = await getCartAPI(cartId);
      set({ cart, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

// Custom hook for easier usage
export function useCart() {
  const store = useCartStore();

  useEffect(() => {
    store.fetchCart();
  }, []);

  return store;
}
```

### User Store

```typescript
// lib/store/user-store.ts
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { user, token } = await loginAPI(credentials);
      localStorage.setItem("authToken", token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({ user: null, isAuthenticated: false });
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const { user, token } = await registerAPI(userData);
      localStorage.setItem("authToken", token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const updatedUser = await updateProfileAPI(data);
      set({ user: updatedUser, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
```

## Payment Integration

### Payment Methods Configuration

```typescript
// lib/types/payment.ts
export type PaymentMethod = "stripe" | "cod";

export interface PaymentConfig {
  stripe: {
    publishableKey: string;
    supportedCountries: string[];
    supportedCurrencies: string[];
  };
  cod: {
    supportedCountries: string[];
    supportedCities: string[];
    maxOrderValue: number;
    currency: string;
  };
}

export const paymentConfig: PaymentConfig = {
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    supportedCountries: ["US", "GB", "CA", "AU", "JO"],
    supportedCurrencies: ["USD", "GBP", "CAD", "AUD", "JOD"],
  },
  cod: {
    supportedCountries: ["JO"], // Jordan only
    supportedCities: ["Amman", "Irbid", "Zarqa", "Aqaba", "Salt"],
    maxOrderValue: 20000, // 200 JOD in cents
    currency: "JOD",
  },
};
```

### Stripe Integration

```typescript
// components/checkout/stripe-payment.tsx
interface StripePaymentProps {
  clientSecret: string;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (error: StripeError) => void;
}

export function StripePayment({
  clientSecret,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <PaymentElement />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isLoading}
        loading={isLoading}
      >
        Pay Now
      </Button>
    </form>
  );
}
```

### Cash on Delivery Component

```typescript
// components/checkout/cod-payment.tsx
interface CODPaymentProps {
  order: Order;
  onConfirm: () => void;
}

export function CODPayment({ order, onConfirm }: CODPaymentProps) {
  const { t } = useTranslations("checkout");

  const codFee = 200; // 2 JOD in cents
  const totalWithCOD = order.total + codFee;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">{t("cod.title")}</h3>
            <p className="text-sm text-blue-700 mt-1">{t("cod.description")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{t("orderTotal")}</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>{t("cod.fee")}</span>
          <span>{formatPrice(codFee)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-2">
          <span>{t("total")}</span>
          <span>{formatPrice(totalWithCOD)}</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900">
              {t("cod.importantNote")}
            </h4>
            <ul className="text-sm text-amber-700 mt-1 space-y-1">
              <li>• {t("cod.note1")}</li>
              <li>• {t("cod.note2")}</li>
              <li>• {t("cod.note3")}</li>
            </ul>
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={onConfirm}>
        {t("cod.confirmOrder")}
      </Button>
    </div>
  );
}
```

### Payment Method Selection

```typescript
// components/checkout/payment-methods.tsx
interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  shippingAddress: Address;
}

export function PaymentMethods({
  selectedMethod,
  onMethodChange,
  shippingAddress,
}: PaymentMethodsProps) {
  const { t } = useTranslations("checkout");

  const isJordan = shippingAddress.country === "JO";
  const isCODAvailable =
    isJordan &&
    paymentConfig.cod.supportedCities.includes(shippingAddress.city);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{t("paymentMethod")}</h3>

      <div className="space-y-3">
        {/* Stripe Payment */}
        <div className="relative">
          <input
            type="radio"
            id="stripe"
            name="payment-method"
            value="stripe"
            checked={selectedMethod === "stripe"}
            onChange={() => onMethodChange("stripe")}
            className="peer sr-only"
          />
          <label
            htmlFor="stripe"
            className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5"
          >
            <CreditCard className="h-5 w-5" />
            <div>
              <div className="font-medium">{t("stripe.title")}</div>
              <div className="text-sm text-muted-foreground">
                {t("stripe.description")}
              </div>
            </div>
          </label>
        </div>

        {/* Cash on Delivery */}
        {isCODAvailable && (
          <div className="relative">
            <input
              type="radio"
              id="cod"
              name="payment-method"
              value="cod"
              checked={selectedMethod === "cod"}
              onChange={() => onMethodChange("cod")}
              className="peer sr-only"
            />
            <label
              htmlFor="cod"
              className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5"
            >
              <Truck className="h-5 w-5" />
              <div>
                <div className="font-medium">{t("cod.title")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("cod.description")} (+{formatPrice(200)})
                </div>
              </div>
            </label>
          </div>
        )}

        {isJordan && !isCODAvailable && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-700">
              {t("cod.notAvailableInCity")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Internationalization

### Next-intl Configuration

```typescript
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["en", "ar"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### Locale-specific Formatting

```typescript
// lib/utils/format.ts
export function formatPrice(
  amount: number,
  currency: string = "USD",
  locale: string = "en"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JOD" ? 3 : 2,
    maximumFractionDigits: currency === "JOD" ? 3 : 2,
  }).format(amount / 100);
}

export function formatDate(date: Date | string, locale: string = "en"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}
```

### Language Messages

```json
// messages/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Try again",
    "save": "Save",
    "cancel": "Cancel",
    "continue": "Continue",
    "back": "Back"
  },
  "navigation": {
    "home": "Home",
    "products": "Products",
    "categories": "Categories",
    "about": "About",
    "contact": "Contact",
    "account": "Account",
    "cart": "Cart"
  },
  "cart": {
    "title": "Shopping Cart",
    "itemsInCart": "items in cart",
    "emptyCart": "Your cart is empty",
    "subtotal": "Subtotal",
    "proceedToCheckout": "Proceed to Checkout",
    "viewCart": "View Cart",
    "addedToCart": "Added to cart!"
  },
  "checkout": {
    "title": "Checkout",
    "shippingAddress": "Shipping Address",
    "paymentMethod": "Payment Method",
    "orderSummary": "Order Summary",
    "placeOrder": "Place Order",
    "orderTotal": "Order Total",
    "total": "Total",
    "stripe": {
      "title": "Credit Card",
      "description": "Pay securely with your credit or debit card"
    },
    "cod": {
      "title": "Cash on Delivery",
      "description": "Pay when you receive your order",
      "fee": "COD Fee",
      "confirmOrder": "Confirm Order",
      "importantNote": "Important Notes:",
      "note1": "Payment must be made in cash upon delivery",
      "note2": "Please have exact change ready",
      "note3": "Orders may be cancelled if payment is refused",
      "notAvailableInCity": "Cash on delivery is not available in your city"
    }
  }
}
```

```json
// messages/ar.json
{
  "common": {
    "loading": "جاري التحميل...",
    "error": "حدث خطأ ما",
    "retry": "المحاولة مرة أخرى",
    "save": "حفظ",
    "cancel": "إلغاء",
    "continue": "متابعة",
    "back": "رجوع"
  },
  "navigation": {
    "home": "الرئيسية",
    "products": "المنتجات",
    "categories": "الفئات",
    "about": "من نحن",
    "contact": "اتصل بنا",
    "account": "الحساب",
    "cart": "السلة"
  },
  "cart": {
    "title": "سلة التسوق",
    "itemsInCart": "عنصر في السلة",
    "emptyCart": "سلة التسوق فارغة",
    "subtotal": "المجموع الفرعي",
    "proceedToCheckout": "متابعة للدفع",
    "viewCart": "عرض السلة",
    "addedToCart": "تم إضافة المنتج للسلة!"
  },
  "checkout": {
    "title": "إتمام الطلب",
    "shippingAddress": "عنوان الشحن",
    "paymentMethod": "طريقة الدفع",
    "orderSummary": "ملخص الطلب",
    "placeOrder": "تأكيد الطلب",
    "orderTotal": "إجمالي الطلب",
    "total": "المجموع",
    "stripe": {
      "title": "بطاقة ائتمان",
      "description": "ادفع بأمان باستخدام بطاقتك الائتمانية"
    },
    "cod": {
      "title": "الدفع عند الاستلام",
      "description": "ادفع عند استلام طلبك",
      "fee": "رسوم الدفع عند الاستلام",
      "confirmOrder": "تأكيد الطلب",
      "importantNote": "ملاحظات مهمة:",
      "note1": "يجب دفع المبلغ نقداً عند التسليم",
      "note2": "يرجى تحضير المبلغ المطلوب",
      "note3": "قد يتم إلغاء الطلب في حالة رفض الدفع",
      "notAvailableInCity": "الدفع عند الاستلام غير متوفر في مدينتك"
    }
  }
}
```

## Performance Optimization

### Image Optimization

```typescript
// components/common/optimized-image.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/2gAMAwEAAhEDEQA/AKVJbgAAAAAElFTkSuQmCC"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

### Lazy Loading Components

```typescript
// components/common/lazy-wrapper.tsx
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "./loading-spinner";

export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFn);

  return function WrappedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Usage
export const ProductGallery = createLazyComponent(
  () => import("./product-gallery")
);
```

### API Optimization

```typescript
// lib/api/client.ts
class APIClient {
  private baseURL: string;
  private cache = new Map();

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getCacheKey(url: string, params?: any): string {
    return `${url}${params ? JSON.stringify(params) : ""}`;
  }

  async get<T>(
    url: string,
    options?: {
      cache?: boolean;
      cacheTTL?: number;
      params?: Record<string, any>;
    }
  ): Promise<T> {
    const cacheKey = this.getCacheKey(url, options?.params);

    // Check cache first
    if (options?.cache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < (options.cacheTTL || 5 * 60 * 1000)) {
        return cached.data;
      }
    }

    const queryString = options?.params
      ? "?" + new URLSearchParams(options.params).toString()
      : "";

    const response = await fetch(`${this.baseURL}${url}${queryString}`, {
      next: { revalidate: options?.cache ? options.cacheTTL || 300 : 0 },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Cache successful responses
    if (options?.cache) {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    }

    return data;
  }

  async post<T>(url: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!);
```

### Virtual Scrolling for Large Lists

```typescript
// components/common/virtual-list.tsx
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: "absolute",
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: "100%",
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Implementation Steps

### Phase 1: Project Setup and Core Infrastructure (Week 1)

#### Step 1.1: Initialize Next.js Project

```bash
# Create new Next.js project
npx create-next-app@latest skinior-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd skinior-frontend

# Install additional dependencies
pnpm add \
  @headlessui/react \
  @heroicons/react \
  @stripe/stripe-js \
  @stripe/react-stripe-js \
  next-intl \
  react-hook-form \
  @hookform/resolvers \
  zod \
  zustand \
  lucide-react \
  clsx \
  tailwind-merge \
  vaul

# Install dev dependencies
pnpm add -D \
  @types/node \
  @testing-library/react \
  @testing-library/jest-dom \
  vitest \
  jsdom
```

#### Step 1.2: Configure TypeScript

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### Step 1.3: Setup Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-noto-sans-arabic)", "system-ui", "sans-serif"],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

#### Step 1.4: Setup Global Styles

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  html[dir="rtl"] {
    font-family: var(--font-noto-sans-arabic), system-ui, sans-serif;
  }

  html[dir="ltr"] {
    font-family: var(--font-inter), system-ui, sans-serif;
  }
}

@layer components {
  .container {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }

  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50;
  }

  .btn-primary {
    @apply btn bg-primary text-primary-foreground hover:bg-primary/90;
  }

  .btn-secondary {
    @apply btn bg-secondary text-secondary-foreground hover:bg-secondary/80;
  }

  .btn-outline {
    @apply btn border border-input hover:bg-accent hover:text-accent-foreground;
  }

  .input {
    @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
  }

  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }

  .gradient-overlay {
    @apply bg-gradient-to-t from-black/60 to-transparent;
  }

  .skeleton {
    @apply animate-pulse bg-muted rounded;
  }

  /* Arabic text improvements */
  [dir="rtl"] .text-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Loading states */
  .loading-dots {
    @apply inline-block relative w-4 h-4;
  }

  .loading-dots::after {
    content: "";
    @apply absolute w-1 h-1 bg-current rounded-full;
    animation: loading-dots 1.4s infinite ease-in-out both;
  }

  @keyframes loading-dots {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .rtl\:rotate-180 [dir="rtl"] & {
    transform: rotate(180deg);
  }

  .ltr\:rotate-0 [dir="ltr"] & {
    transform: rotate(0deg);
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .btn-primary {
    @apply border-2 border-black;
  }

  .input {
    @apply border-2 border-black;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Phase 2: Core Components Development (Week 2)

#### Step 2.1: Create Base UI Components

```bash
# Create component directories
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/product
mkdir -p src/components/cart
mkdir -p src/components/checkout
mkdir -p src/components/common

# Create utility files
mkdir -p src/lib/utils
mkdir -p src/lib/types
mkdir -p src/lib/hooks
mkdir -p src/lib/store
```

#### Step 2.2: Implement Core Layouts

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      template: `%s | ${t("title")}`,
      default: t("title"),
    },
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "Skinior AI" }],
    creator: "Skinior AI",
    publisher: "Skinior AI",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      type: "website",
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/images/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} ${notoSansArabic.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

#### Step 2.3: Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (if using local state sync)
DATABASE_URL=postgresql://...

# Email (for notifications)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@skinior.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-...
```

### Phase 3: Product Catalog Implementation (Week 3)

#### Step 3.1: Product API Integration

```typescript
// lib/api/products.ts
export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "name" | "created_at";
  sortOrder?: "asc" | "desc";
  inStock?: boolean;
}

export async function getProducts(params: GetProductsParams = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${searchParams}`,
    {
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getProduct(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
    {
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}

export async function searchProducts(query: string, filters?: any) {
  const searchParams = new URLSearchParams({
    q: query,
    ...filters,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/search?${searchParams}`,
    {
      next: { revalidate: 60 }, // Cache search results for 1 minute
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  return response.json();
}
```

#### Step 3.2: Product Pages Implementation

```typescript
// app/[locale]/products/page.tsx
import { Suspense } from "react";
import { getProducts } from "@/lib/api/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { Pagination } from "@/components/common/pagination";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface ProductsPageProps {
  searchParams: {
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
    price?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const page = Number(searchParams.page) || 1;
  const category = searchParams.category;
  const search = searchParams.search;
  const sort = searchParams.sort?.split("-") || ["name", "asc"];
  const priceRange = searchParams.price?.split("-").map(Number);

  const params = {
    page,
    limit: 20,
    category,
    search,
    sortBy: sort[0] as any,
    sortOrder: sort[1] as any,
    minPrice: priceRange?.[0],
    maxPrice: priceRange?.[1],
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-6">
          <Suspense fallback={<div className="h-64 skeleton" />}>
            <ProductFilters />
          </Suspense>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {category ? `${category} Products` : "All Products"}
            </h1>
            <ProductSort />
          </div>

          {/* Products Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductsGrid params={params} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function ProductsGrid({ params }: { params: any }) {
  const { data: products, pagination } = await getProducts(params);

  return (
    <div className="space-y-6">
      <ProductGrid products={products} />
      <Pagination {...pagination} />
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="aspect-square skeleton" />
          <div className="space-y-2">
            <div className="h-4 skeleton w-3/4" />
            <div className="h-3 skeleton w-1/2" />
            <div className="h-4 skeleton w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Phase 4: Cart Implementation (Week 4)

#### Step 4.1: Cart Store Implementation

```typescript
// lib/store/cart-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    name: string;
    image: string;
    slug: string;
  };
  variant: {
    name: string;
    sku: string;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  updatedAt: string;
}

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id" | "totalPrice">) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,
      error: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: async (newItem) => {
        set({ isLoading: true, error: null });

        try {
          const currentCart = get().cart;
          const cartId = currentCart?.id || crypto.randomUUID();

          // Optimistic update
          set((state) => {
            if (!state.cart) {
              state.cart = {
                id: cartId,
                items: [],
                subtotal: 0,
                tax: 0,
                shipping: 0,
                discount: 0,
                total: 0,
                currency: "USD",
                updatedAt: new Date().toISOString(),
              };
            }

            const existingItemIndex = state.cart.items.findIndex(
              (item) => item.variantId === newItem.variantId
            );

            if (existingItemIndex >= 0) {
              state.cart.items[existingItemIndex].quantity += newItem.quantity;
              state.cart.items[existingItemIndex].totalPrice =
                state.cart.items[existingItemIndex].quantity *
                newItem.unitPrice;
            } else {
              state.cart.items.push({
                ...newItem,
                id: crypto.randomUUID(),
                totalPrice: newItem.quantity * newItem.unitPrice,
              });
            }

            // Recalculate totals
            state.cart.subtotal = state.cart.items.reduce(
              (sum, item) => sum + item.totalPrice,
              0
            );
            state.cart.total =
              state.cart.subtotal +
              state.cart.tax +
              state.cart.shipping -
              state.cart.discount;
            state.cart.updatedAt = new Date().toISOString();
          });

          // Sync with server
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}/items`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: newItem.productId,
                variantId: newItem.variantId,
                quantity: newItem.quantity,
              }),
            }
          );

          set({ isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true, error: null });

        try {
          const cartId = get().cart?.id;
          if (!cartId) return;

          // Optimistic update
          set((state) => {
            if (state.cart) {
              state.cart.items = state.cart.items.filter(
                (item) => item.id !== itemId
              );
              state.cart.subtotal = state.cart.items.reduce(
                (sum, item) => sum + item.totalPrice,
                0
              );
              state.cart.total =
                state.cart.subtotal +
                state.cart.tax +
                state.cart.shipping -
                state.cart.discount;
              state.cart.updatedAt = new Date().toISOString();
            }
          });

          // Sync with server
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}/items/${itemId}`,
            {
              method: "DELETE",
            }
          );

          set({ isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateQuantity: async (itemId, quantity) => {
        if (quantity <= 0) return get().removeItem(itemId);

        set({ isLoading: true, error: null });

        try {
          const cartId = get().cart?.id;
          if (!cartId) return;

          // Optimistic update
          set((state) => {
            if (state.cart) {
              const item = state.cart.items.find((item) => item.id === itemId);
              if (item) {
                item.quantity = quantity;
                item.totalPrice = quantity * item.unitPrice;
                state.cart.subtotal = state.cart.items.reduce(
                  (sum, item) => sum + item.totalPrice,
                  0
                );
                state.cart.total =
                  state.cart.subtotal +
                  state.cart.tax +
                  state.cart.shipping -
                  state.cart.discount;
                state.cart.updatedAt = new Date().toISOString();
              }
            }
          });

          // Sync with server
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}/items/${itemId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantity }),
            }
          );

          set({ isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });

        try {
          const cartId = get().cart?.id;
          if (!cartId) return;

          set({ cart: null });

          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, {
            method: "DELETE",
          });

          set({ isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      syncWithServer: async () => {
        set({ isLoading: true, error: null });

        try {
          const cartId = get().cart?.id;
          if (!cartId) {
            set({ isLoading: false });
            return;
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`
          );
          if (response.ok) {
            const serverCart = await response.json();
            set({ cart: serverCart.data });
          }

          set({ isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
    })),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

// Custom hook for cart operations
export function useCart() {
  const store = useCartStore();

  // Sync with server on mount
  useEffect(() => {
    store.syncWithServer();
  }, []);

  return {
    ...store,
    itemCount:
      store.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
    isEmpty: !store.cart?.items.length,
  };
}
```

#### Step 4.2: Cart Components

```typescript
// components/cart/cart-button.tsx
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CartButton() {
  const { toggleCart, itemCount } = useCart();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleCart}
      className="relative"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
}
```

### Phase 5: Checkout Implementation (Week 5)

#### Step 5.1: Checkout Form Components

```typescript
// components/checkout/checkout-form.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ShippingForm } from "./shipping-form";
import { PaymentMethods } from "./payment-methods";
import { OrderSummary } from "./order-summary";
import { StripePayment } from "./stripe-payment";
import { CODPayment } from "./cod-payment";
import { useCart } from "@/lib/store/cart-store";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const checkoutSchema = z.object({
  customer: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(1),
  }),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().min(2).max(2),
    phone: z.string().min(1),
  }),
  billingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().min(2).max(2),
    phone: z.string().min(1),
  }),
  shippingMethod: z.string(),
  paymentMethod: z.enum(["stripe", "cod"]),
  sameAsBilling: z.boolean().default(false),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">(
    "stripe"
  );
  const [clientSecret, setClientSecret] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  const { cart, clearCart } = useCart();

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "stripe",
      sameAsBilling: true,
      shippingMethod: "standard",
    },
  });

  const onSubmit = async (data: CheckoutData) => {
    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart?.id,
          ...data,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      if (data.paymentMethod === "stripe") {
        // Create payment intent
        const paymentResponse = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            amount: order.total,
            currency: order.currency,
          }),
        });

        const { clientSecret } = await paymentResponse.json();
        setClientSecret(clientSecret);
        setStep(4); // Payment step
      } else {
        // COD - Order is confirmed
        await clearCart();
        window.location.href = `/orders/${order.id}/confirmation`;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    i <= step ? "bg-primary text-white" : "bg-muted"
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>

            {/* Step 1: Customer Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...form.register("customer.firstName")}
                    error={form.formState.errors.customer?.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    {...form.register("customer.lastName")}
                    error={form.formState.errors.customer?.lastName?.message}
                  />
                  <Input
                    label="Email"
                    type="email"
                    {...form.register("customer.email")}
                    error={form.formState.errors.customer?.email?.message}
                  />
                  <Input
                    label="Phone"
                    {...form.register("customer.phone")}
                    error={form.formState.errors.customer?.phone?.message}
                  />
                </div>
                <Button type="button" onClick={nextStep}>
                  Continue to Shipping
                </Button>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <ShippingForm form={form} onNext={nextStep} onBack={prevStep} />
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Payment Method</h2>
                <PaymentMethods
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  shippingAddress={form.getValues("shippingAddress")}
                />
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    loading={isProcessing}
                    disabled={isProcessing}
                  >
                    {paymentMethod === "cod"
                      ? "Place Order"
                      : "Continue to Payment"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Payment (Stripe only) */}
            {step === 4 && paymentMethod === "stripe" && clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePayment
                  clientSecret={clientSecret}
                  onSuccess={async () => {
                    await clearCart();
                    window.location.href = "/checkout/success";
                  }}
                  onError={(error) => {
                    console.error("Payment error:", error);
                  }}
                />
              </Elements>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
```

#### Step 5.2: Payment Processing

```typescript
// app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, currency = "USD" } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      metadata: {
        orderId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
```

### Phase 6: Testing & Quality Assurance (Week 6)

#### Step 6.1: Unit Testing Setup

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});
```

#### Step 6.2: Component Tests

```typescript
// components/cart/__tests__/cart-button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartButton } from "../cart-button";
import { useCart } from "@/lib/store/cart-store";

vi.mock("@/lib/store/cart-store");

describe("CartButton", () => {
  const mockToggleCart = vi.fn();

  beforeEach(() => {
    vi.mocked(useCart).mockReturnValue({
      toggleCart: mockToggleCart,
      itemCount: 0,
      cart: null,
      isOpen: false,
      isLoading: false,
      error: null,
      openCart: vi.fn(),
      closeCart: vi.fn(),
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      syncWithServer: vi.fn(),
      isEmpty: true,
    });
  });

  it("renders cart button", () => {
    render(<CartButton />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(
      screen.getByLabelText(/shopping cart with 0 items/i)
    ).toBeInTheDocument();
  });

  it("shows item count badge when cart has items", () => {
    vi.mocked(useCart).mockReturnValue({
      ...vi.mocked(useCart)(),
      itemCount: 3,
    });

    render(<CartButton />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls toggleCart when clicked", () => {
    render(<CartButton />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockToggleCart).toHaveBeenCalledOnce();
  });
});
```

#### Step 6.3: Integration Tests

```typescript
// components/checkout/__tests__/checkout-flow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CheckoutForm } from "../checkout-form";
import { useCart } from "@/lib/store/cart-store";

// Mock Stripe
vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() => Promise.resolve({})),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: any) => children,
  useStripe: () => ({}),
  useElements: () => ({}),
  PaymentElement: () => (
    <div data-testid="payment-element">Payment Element</div>
  ),
}));

describe("Checkout Flow", () => {
  beforeEach(() => {
    vi.mocked(useCart).mockReturnValue({
      cart: {
        id: "cart-123",
        items: [
          {
            id: "item-1",
            productId: "prod-1",
            variantId: "var-1",
            quantity: 2,
            unitPrice: 2950,
            totalPrice: 5900,
            product: { name: "Test Product", image: "test.jpg", slug: "test" },
            variant: { name: "30ml", sku: "TEST-30" },
          },
        ],
        subtotal: 5900,
        tax: 472,
        shipping: 500,
        discount: 0,
        total: 6372,
        currency: "USD",
        updatedAt: new Date().toISOString(),
      },
      clearCart: vi.fn(),
      isOpen: false,
      isLoading: false,
      error: null,
      openCart: vi.fn(),
      closeCart: vi.fn(),
      toggleCart: vi.fn(),
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      syncWithServer: vi.fn(),
      itemCount: 2,
      isEmpty: false,
    });

    global.fetch = vi.fn();
  });

  it("completes checkout flow with valid data", async () => {
    vi.mocked(fetch).mockImplementation((url) => {
      if (url.includes("/api/orders")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: "order-123",
              total: 6372,
              currency: "USD",
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<CheckoutForm />);

    // Fill customer information
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: "+1234567890" },
    });

    // Continue to next step
    fireEvent.click(screen.getByText(/continue to shipping/i));

    await waitFor(() => {
      expect(screen.getByText(/shipping address/i)).toBeInTheDocument();
    });
  });

  it("handles COD payment method for Jordan", async () => {
    render(<CheckoutForm />);

    // Navigate to payment method step
    // ... fill previous steps ...

    // Select COD payment
    fireEvent.click(screen.getByLabelText(/cash on delivery/i));

    await waitFor(() => {
      expect(screen.getByText(/cod fee/i)).toBeInTheDocument();
    });
  });
});
```

### Phase 7: Deployment & Optimization (Week 7)

#### Step 7.1: Production Build Configuration

```typescript
// next.config.ts - Production optimizations
const nextConfig: NextConfig = {
  // ... existing config

  // Production optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "@headlessui/react"],
  },

  // Bundle analyzer
  ...(process.env.ANALYZE === "true" && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
      }
      return config;
    },
  }),

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/products/:path*",
        has: [{ type: "query", key: "old_id" }],
        destination: "/products/:path*",
        permanent: true,
      },
    ];
  },
};
```

#### Step 7.2: Performance Monitoring

```typescript
// lib/analytics/performance.ts
export function reportWebVitals(metric: any) {
  const { id, name, value, label } = metric;

  // Send to analytics service
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, {
      event_category:
        label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
      value: Math.round(name === "CLS" ? value * 1000 : value),
      event_label: id,
      non_interaction: true,
    });
  }

  // Send to performance monitoring service
  if (process.env.NODE_ENV === "production") {
    fetch("/api/analytics/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metric),
    }).catch(console.error);
  }
}

// Custom performance hooks
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        setMetrics((prev) => [...prev, ...entries]);
      });

      observer.observe({
        entryTypes: ["navigation", "paint", "largest-contentful-paint"],
      });

      return () => observer.disconnect();
    }
  }, []);

  return metrics;
}
```

#### Step 7.3: SEO Optimization

```typescript
// app/[locale]/products/[id]/page.tsx - SEO optimized product page
import { Metadata } from "next";
import { getProduct } from "@/lib/api/products";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: { locale: string; id: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { data: product } = await getProduct(params.id);

    return {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      keywords: product.tags?.join(", "),
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images.map((img: any) => ({
          url: img.url,
          width: 800,
          height: 600,
          alt: img.altText || product.name,
        })),
        type: "product",
      },
      alternates: {
        canonical: `/products/${product.slug || params.id}`,
        languages: {
          en: `/en/products/${product.slug || params.id}`,
          ar: `/ar/products/${product.slug || params.id}`,
        },
      },
      other: {
        "product:price:amount": (product.price / 100).toString(),
        "product:price:currency": product.currency,
        "product:availability": product.variants.some((v: any) => v.available)
          ? "in stock"
          : "out of stock",
        "product:condition": "new",
      },
    };
  } catch {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
}

export async function generateStaticParams() {
  // Generate static params for popular products
  const { data: products } = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=100&sortBy=popularity`
  ).then((res) => res.json());

  return products.map((product: any) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { data: product } = await getProduct(params.id);

    // JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.images.map((img: any) => img.url),
      sku: product.variants[0]?.sku,
      brand: {
        "@type": "Brand",
        name: "Skinior",
      },
      offers: product.variants.map((variant: any) => ({
        "@type": "Offer",
        price: (variant.price / 100).toString(),
        priceCurrency: product.currency,
        availability: variant.available
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Skinior",
        },
      })),
      aggregateRating: product.reviews
        ? {
            "@type": "AggregateRating",
            ratingValue: product.reviews.averageRating,
            reviewCount: product.reviews.totalReviews,
          }
        : undefined,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductDetailPage product={product} />
      </>
    );
  } catch {
    notFound();
  }
}
```

This completes the comprehensive frontend documentation! The document now covers:

✅ **Complete Tech Stack** - Next.js 15, TypeScript, Tailwind CSS  
✅ **Project Structure** - Organized directory layout  
✅ **Component Architecture** - Reusable, accessible components  
✅ **State Management** - Zustand with persistence  
✅ **Payment Integration** - Stripe + Cash on Delivery for Jordan  
✅ **Internationalization** - Arabic and English support  
✅ **Performance Optimization** - Image optimization, lazy loading, caching  
✅ **Step-by-step Implementation** - 7-week development timeline  
✅ **Testing Strategy** - Unit and integration tests  
✅ **SEO Optimization** - Metadata, structured data, performance

The documentation provides a complete roadmap for building a production-ready e-commerce frontend that supports both international customers (Stripe) and local Jordanian customers (Cash on Delivery).
