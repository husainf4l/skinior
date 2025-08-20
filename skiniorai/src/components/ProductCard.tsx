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

  const handleAddToCartSuccess = useCallback(() => {
    // Prevent navigation to product page when add to cart succeeds
    console.log(`Added ${product.title} to cart successfully`);
  }, [product.title]);

  const handleAddToCartError = useCallback((error: Error) => {
    console.error("Failed to add to cart:", error);
  }, []);

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
      className={`group relative bg-white/70 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-700 ease-out hover:bg-white hover:shadow-xl hover:shadow-black/5 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer ${
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
      {/* Optimized Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Main Product Image */}
        <Image
          src={isHovered && hoverImage ? hoverImage : mainImage}
          alt={name}
          fill
          className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
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
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
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

        {/* Compact Badge */}
        {(product.isNew || onSale || getDiscountPercentage() > 0) && (
          <div className={`absolute top-2 ${isRTL ? "right-2" : "left-2"}`}>
            {product.isNew && (
              <div className="px-1.5 py-0.5 bg-black/90 backdrop-blur-xl text-white text-xs font-medium rounded-md">
                {t("products.new")}
              </div>
            )}
            {onSale && !product.isNew && (
              <div className="px-1.5 py-0.5 bg-red-600/90 backdrop-blur-xl text-white text-xs font-medium rounded-md">
                {getDiscountPercentage() > 0
                  ? `${getDiscountPercentage()}%`
                  : t("products.sale")}
              </div>
            )}
          </div>
        )}

        {!product.isInStock && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center">
            <div className="px-3 py-1 bg-gray-900/90 backdrop-blur-xl text-white text-xs font-medium rounded-md">
              {t("products.outOfStock")}
            </div>
          </div>
        )}

        {/* Compact Wishlist */}
        <div
          className={`absolute top-2 ${
            isRTL ? "left-2" : "right-2"
          } opacity-0 group-hover:opacity-100 transition-all duration-300`}
        >
          <button
            className={`w-7 h-7 bg-white/90 backdrop-blur-xl hover:bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
              isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
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
              className="w-3.5 h-3.5"
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

      {/* Ultra Compact Content */}
      <div className="p-3 space-y-2">
        <h3
          className={`text-sm font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {name}
        </h3>

        {/* Ultra Compact Rating */}
        <div
          className={`flex items-center gap-1 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`flex items-center gap-0.5 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${
                  i < Math.floor(rating) ? "bg-yellow-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        {/* Ultra Compact Pricing & Action */}
        <div className="space-y-2">
          <div
            className={`flex items-baseline gap-2 ${
              isRTL ? "flex-row-reverse justify-start" : "justify-start"
            }`}
          >
            <span
              className={`text-base font-semibold text-gray-900 price ${
                isRTL ? "font-cairo" : ""
              }`}
            >
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span
                className={`text-xs text-gray-600 line-through price ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <AddToCartButton
            productId={product.id}
            disabled={!product.isInStock}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
