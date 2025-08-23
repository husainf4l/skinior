"use client";

import { use } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { productsService } from "@/services/productsService";
import { type Product } from "@/types/product";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductAttributeSelector, {
  type AttributeSelection,
} from "@/components/product/ProductAttributeSelector";

interface ProductPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

const ProductPage = ({ params }: ProductPageProps) => {
  const { id } = use(params);
  const t = useTranslations();
  const locale = useLocale();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] =
    useState<AttributeSelection>({});

  const isRTL = locale === "ar";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await productsService.getProductById(id);

        if (!productData) {
          notFound();
          return;
        }

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Remove locale dependency

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return isRTL ? "0.00 د.أ" : "JOD 0.00";
    return isRTL ? `${price.toFixed(2)} د.أ` : `JOD ${price.toFixed(2)}`;
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleAttributeSelectionChange = (selections: AttributeSelection) => {
    setSelectedAttributes(selections);
  };

  // Check if all required attributes are selected
  const isValidAttributeSelection = () => {
    if (!product?.attributes) return true;

    return Object.keys(product.attributes).every((attributeName) => {
      return (
        selectedAttributes[attributeName] !== null &&
        selectedAttributes[attributeName] !== undefined
      );
    });
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${
          isRTL ? "rtl font-cairo" : "ltr"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse"></div>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl bg-gray-200 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${
          isRTL ? "rtl font-cairo" : "ltr"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="text-center">
            <h1
              className={`text-2xl font-bold text-gray-900 mb-4 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {error || t("products.notFound")}
            </h1>
            <p className={`text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
              {isRTL
                ? "المنتج غير موجود أو حدث خطأ"
                : "Product not found or an error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // Get localized content
  const productName = isRTL ? product.titleAr : product.title;

  // Create images array from product data with null check and fallback
  const productImages = product.images?.filter((img) => img.url) || [];

  // Ensure selected index is valid
  const validSelectedImageIndex = Math.min(
    selectedImageIndex,
    productImages.length - 1
  );
  const currentImage = productImages[validSelectedImageIndex];
  const currentImageSrc = currentImage?.url || "/product-holder.webp";
  const currentImageAlt =
    currentImage?.altText || productName || "Product image";
  const productDescription = isRTL
    ? product.descriptionAr
    : product.descriptionEn;
  const features = isRTL ? product.featuresAr : product.features;
  const ingredients = isRTL ? product.ingredientsAr : product.ingredients;
  const howToUse = isRTL ? product.howToUseAr : product.howToUse;
  const categoryName = isRTL
    ? product.category?.nameAr
    : product.category?.name;
  const brandName = isRTL ? product.brand?.nameAr : product.brand?.name;
  const rating = product.reviewStats?.averageRating || 0;
  const reviewCount = product.reviewStats?.totalReviews || 0;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${
        isRTL ? "rtl font-cairo" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${
            isRTL ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          {/* Ultra-Premium Image Gallery */}
          <div className={`space-y-4 ${isRTL ? "lg:order-2" : ""}`}>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5">
              <Image
                src={currentImageSrc}
                alt={currentImageAlt}
                fill
                className="object-cover object-center transition-all duration-700 ease-out"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {productImages.length > 1 &&
                productImages.map((img, index: number) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "ring-2 ring-gray-900/30 ring-offset-2 shadow-md"
                        : "hover:shadow-md opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={img.url || "/product-holder.webp"}
                      alt={img.altText || `${productName} ${index + 1}`}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Compact Product Details */}
          <div className={`space-y-6 ${isRTL ? "lg:order-1" : ""}`}>
            {/* Header */}
            <div className="space-y-4">
              <div
                className={`flex items-center gap-4 text-xs font-medium text-gray-400 tracking-wide ${
                  isRTL ? "flex-row-reverse justify-start" : "justify-start"
                }`}
              >
                <span className={isRTL ? "font-cairo" : ""}>
                  {brandName || (isRTL ? "سكينيور" : "Skinior")}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className={isRTL ? "font-cairo" : ""}>
                  SKU {product.sku}
                </span>
              </div>

              <h1
                className={`text-2xl lg:text-3xl font-light text-gray-900 leading-tight ${
                  isRTL ? "text-right font-cairo" : "text-left"
                }`}
              >
                {productName}
              </h1>

              {/* Product Badges */}
              {(product.isNew || product.isFeatured) && (
                <div
                  className={`flex gap-2 ${
                    isRTL ? "justify-end" : "justify-start"
                  }`}
                >
                  {product.isNew && (
                    <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded-md">
                      {isRTL ? "جديد" : "NEW"}
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
                      {isRTL ? "مميز" : "FEATURED"}
                    </span>
                  )}
                </div>
              )}

              {/* Rating */}
              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse justify-start" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-center gap-1 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < Math.floor(rating) ? "bg-yellow-400" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-sm text-gray-500 font-medium ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {rating} • {reviewCount}{" "}
                  {reviewCount === 1
                    ? t("products.review")
                    : t("products.reviews")}
                </span>
              </div>

              {/* Compare At Price (if no attributes) */}
              {product.compareAtPrice &&
                product.compareAtPrice > product.price &&
                (!product.attributes ||
                  Object.keys(product.attributes).length === 0) && (
                  <div
                    className={`text-sm text-gray-400 line-through font-light ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {formatPrice(product.compareAtPrice)}
                  </div>
                )}

              {/* Current Price */}
              <div
                className={`text-2xl lg:text-3xl font-light text-gray-900 ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Description */}
            {productDescription && (
              <div>
                <p
                  className={`text-gray-600 leading-relaxed ${
                    isRTL ? "text-right font-cairo" : "text-left"
                  }`}
                >
                  {productDescription}
                </p>
              </div>
            )}

            {/* Product Attributes Selector */}
            <ProductAttributeSelector
              product={product}
              locale={locale}
              onSelectionChange={handleAttributeSelectionChange}
              selectedAttributes={selectedAttributes}
            />

            {/* Product Details */}
            <div className="space-y-6">
              {/* Brand and Category */}
              <div className="grid grid-cols-2 gap-4">
                {brandName && (
                  <div>
                    <h3
                      className={`text-sm font-medium text-gray-900 mb-1 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {isRTL ? "العلامة التجارية" : "Brand"}
                    </h3>
                    <p
                      className={`text-sm text-gray-600 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {brandName}
                    </p>
                  </div>
                )}
                {categoryName && (
                  <div>
                    <h3
                      className={`text-sm font-medium text-gray-900 mb-1 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {isRTL ? "الفئة" : "Category"}
                    </h3>
                    <p
                      className={`text-sm text-gray-600 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {categoryName}
                    </p>
                  </div>
                )}
              </div>

              {/* Active Ingredients */}
              {product.activeIngredients &&
                product.activeIngredients.trim() && (
                  <div>
                    <h3
                      className={`text-sm font-medium text-gray-900 mb-2 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {isRTL ? "المكونات الفعالة" : "Active Ingredients"}
                    </h3>
                    <p
                      className={`text-sm text-gray-600 ${
                        isRTL ? "font-cairo text-right" : ""
                      }`}
                    >
                      {product.activeIngredients}
                    </p>
                  </div>
                )}

              {/* Skin Type & Usage */}
              {(product.skinType || product.usage) && (
                <div className="grid grid-cols-2 gap-4">
                  {product.skinType && product.skinType.trim() && (
                    <div>
                      <h3
                        className={`text-sm font-medium text-gray-900 mb-1 ${
                          isRTL ? "font-cairo text-right" : ""
                        }`}
                      >
                        {isRTL ? "نوع البشرة" : "Skin Type"}
                      </h3>
                      <p
                        className={`text-sm text-gray-600 ${
                          isRTL ? "font-cairo text-right" : ""
                        }`}
                      >
                        {product.skinType}
                      </p>
                    </div>
                  )}
                  {product.usage && product.usage.trim() && (
                    <div>
                      <h3
                        className={`text-sm font-medium text-gray-900 mb-1 ${
                          isRTL ? "font-cairo text-right" : ""
                        }`}
                      >
                        {isRTL ? "وقت الاستخدام" : "Usage"}
                      </h3>
                      <p
                        className={`text-sm text-gray-600 ${
                          isRTL ? "font-cairo text-right" : ""
                        }`}
                      >
                        {product.usage}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Concerns */}
              {product.concerns && product.concerns.length > 0 && (
                <div>
                  <h3
                    className={`text-sm font-medium text-gray-900 mb-2 ${
                      isRTL ? "font-cairo text-right" : ""
                    }`}
                  >
                    {isRTL ? "يعالج" : "Addresses"}
                  </h3>
                  <div
                    className={`flex flex-wrap gap-2 ${
                      isRTL ? "justify-end" : "justify-start"
                    }`}
                  >
                    {product.concerns.map((concern, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {features && features.length > 0 && (
                <div>
                  <h3
                    className={`text-sm font-medium text-gray-900 mb-3 ${
                      isRTL ? "font-cairo text-right" : ""
                    }`}
                  >
                    {isRTL ? "المميزات" : "Key Features"}
                  </h3>
                  <ul
                    className={`space-y-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {features.map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-2 text-sm text-gray-600 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                        <span className={isRTL ? "font-cairo" : ""}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              {ingredients && ingredients.trim() && (
                <div>
                  <h3
                    className={`text-sm font-medium text-gray-900 mb-2 ${
                      isRTL ? "font-cairo text-right" : ""
                    }`}
                  >
                    {isRTL ? "المكونات" : "Ingredients"}
                  </h3>
                  <p
                    className={`text-sm text-gray-600 leading-relaxed ${
                      isRTL ? "font-cairo text-right" : ""
                    }`}
                  >
                    {ingredients}
                  </p>
                </div>
              )}

              {/* How to Use */}
              {howToUse && howToUse.trim() && (
                <div>
                  <h3
                    className={`text-sm font-medium text-gray-900 mb-2 ${
                      isRTL ? "font-cairo text-right" : ""
                    }`}
                  >
                    {isRTL ? "طريقة الاستخدام" : "How to Use"}
                  </h3>
                  <p
                    className={`text-sm text-gray-600 leading-relaxed ${
                      isRTL ? "font-cairo text-right" : ""
                    }`}
                  >
                    {howToUse}
                  </p>
                </div>
              )}

              {/* Stock Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm">
                  <span
                    className={`text-gray-500 ${isRTL ? "font-cairo" : ""}`}
                  >
                    {isRTL ? "الكمية المتوفرة:" : "Stock:"}
                  </span>
                  <span
                    className={`ml-2 font-medium text-gray-900 ${
                      isRTL ? "font-cairo mr-2" : ""
                    }`}
                  >
                    {product.stockQuantity} {isRTL ? "قطعة" : "units"}
                  </span>
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.isInStock ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm text-gray-600 font-medium ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {product.isInStock
                      ? isRTL
                        ? "متوفر"
                        : "In Stock"
                      : isRTL
                      ? "نفد المخزون"
                      : "Out of Stock"}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span
                    className={`text-sm text-gray-600 font-medium ${
                      isRTL ? "font-cairo" : ""
                    }`}
                  >
                    {t("products.quantity")}
                  </span>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className={`bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 ${
                      isRTL ? "font-cairo text-right" : "text-left"
                    }`}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <AddToCartButton
                  productId={product.id}
                  quantity={quantity}
                  disabled={!product.isInStock || !isValidAttributeSelection()}
                  className="flex-1 py-4 text-lg font-medium"
                  selectedAttributes={selectedAttributes}
                />

                <button
                  className={`bg-white/80 backdrop-blur-xl border border-gray-200 hover:bg-white hover:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 px-6 py-3 rounded-xl font-medium text-gray-900 transition-all duration-300 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                  aria-label={t("products.buyNow")}
                >
                  {t("products.buyNow")}
                </button>

                <button
                  className={`bg-white/80 backdrop-blur-xl border border-gray-200 hover:bg-white hover:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 p-3 rounded-xl transition-all duration-300 ${
                    isWishlisted
                      ? "text-red-500 border-red-200 bg-red-50/80"
                      : "text-gray-600"
                  }`}
                  onClick={handleWishlistToggle}
                  title={
                    isWishlisted
                      ? t("products.removeFromWishlist")
                      : t("products.addToWishlist")
                  }
                  aria-label={
                    isWishlisted
                      ? t("products.removeFromWishlist")
                      : t("products.addToWishlist")
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill={isWishlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
