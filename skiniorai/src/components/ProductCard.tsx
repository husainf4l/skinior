"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, memo, useCallback } from "react";
import { Product } from "@/services/productsService";
import AddToCartButton from "./cart/AddToCartButton";

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isRTL = locale === "ar";

  // Get localized content
  const name = isRTL ? product.titleAr : product.title;

  // Get main and hover images
  const mainImage =
    product.images.find((img) => img.isMain)?.url || "/product-holder.webp";
  const hoverImage =
    product.images.find((img) => img.isHover)?.url || mainImage;

  // Calculate review stats
  const rating = product.reviewStats?.averageRating || 0;
  const reviews = product.reviewStats?.totalReviews || 0;

  // Check if product is on sale
  const onSale = !!product.compareAtPrice;

  const handleCardClick = useCallback(() => {
    router.push(`/${locale}/products/${product.id}`);
  }, [router, locale, product.id]);

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsWishlisted(!isWishlisted);
    },
    [isWishlisted]
  );

  const formatPrice = useCallback(
    (price: number) => {
      return isRTL ? `${price.toFixed(2)} د.أ` : `JOD ${price.toFixed(2)}`;
    },
    [isRTL]
  );

  const getDiscountPercentage = useCallback(() => {
    if (product.compareAtPrice && product.compareAtPrice > product.price) {
      return Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      );
    }
    return 0;
  }, [product.compareAtPrice, product.price]);

  return (
    <div
      className={`group relative bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer ${
        isRTL ? "rtl" : "ltr"
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`${t("products.productDetails")} ${name}`}
    >
      {/* Enhanced Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Main Product Image */}
        <Image
          src={isHovered && hoverImage ? hoverImage : mainImage}
          alt={name}
          fill
          className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          } ${hoverImage && isHovered ? "opacity-0" : "opacity-100"}`}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          quality={85}
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyOpCsIoqKKKkKggUVoooOOhRRQII//2Q=="
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* Hover Image */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${name} hover`}
            fill
            className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyOpCsIoqKKKkKggUVoooOOhRRQII//2Q=="
          />
        )}

        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Enhanced Badge */}
        {(product.isNew || onSale || getDiscountPercentage() > 0) && (
          <div
            className={`absolute top-4 ${isRTL ? "right-4" : "left-4"} z-10`}
          >
            {product.isNew && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-xl text-white text-xs font-semibold rounded-full shadow-lg">
                {t("products.new") || "NEW"}
              </div>
            )}
            {onSale && !product.isNew && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 backdrop-blur-xl text-white text-xs font-semibold rounded-full shadow-lg">
                {getDiscountPercentage() > 0
                  ? `-${getDiscountPercentage()}%`
                  : t("products.sale") || "SALE"}
              </div>
            )}
          </div>
        )}

        {!product.isInStock && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="px-4 py-2 bg-gray-900/90 backdrop-blur-xl text-white text-sm font-medium rounded-full shadow-lg">
              {t("products.outOfStock") || "Out of Stock"}
            </div>
          </div>
        )}

        {/* Enhanced Wishlist */}
        <div
          className={`absolute top-4 ${
            isRTL ? "left-4" : "right-4"
          } opacity-0 group-hover:opacity-100 transition-all duration-300 z-10`}
        >
          <button
            className={`w-10 h-10 bg-white/90 backdrop-blur-xl hover:bg-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110 ${
              isWishlisted
                ? "text-red-500 bg-red-50"
                : "text-gray-400 hover:text-red-500"
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

      {/* Enhanced Responsive Content */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3
          className={`text-base sm:text-lg font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors ${
            isRTL ? "text-right font-cairo" : "text-left"
          }`}
        >
          {name}
        </h3>

        {/* Enhanced Responsive Rating */}
        <div
          className={`flex items-center gap-1 sm:gap-2 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`flex items-center gap-0.5 sm:gap-1 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {reviews > 0 && (
            <span
              className={`text-xs sm:text-sm text-gray-500 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              ({reviews})
            </span>
          )}
        </div>

        {/* Enhanced Responsive Pricing & Action */}
        <div className="space-y-3 sm:space-y-4">
          <div
            className={`flex items-baseline gap-2 sm:gap-3 ${
              isRTL ? "flex-row-reverse justify-start" : "justify-start"
            }`}
          >
            <span
              className={`text-lg sm:text-xl font-semibold text-gray-900 ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span
                className={`text-sm text-gray-500 line-through ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Enhanced Responsive Add to Cart Button */}
          <AddToCartButton
            productId={product.id}
            disabled={!product.isInStock}
            className="w-full py-2.5 sm:py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg apple-button"
          />
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
