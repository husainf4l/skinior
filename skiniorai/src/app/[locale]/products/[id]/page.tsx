import { productsService } from "@/services/productsService";
import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

interface ProductPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

// Generate metadata for better SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  
  try {
    const product = await productsService.getProductById(id);
    
    if (!product) {
      return {
        title: "Product Not Found | Skinior",
        description: "The requested product could not be found.",
      };
    }

    const isRTL = locale === "ar";
    const productName = isRTL ? product.titleAr : product.title;
    const productDescription = isRTL ? product.descriptionAr : product.descriptionEn;
    const brandName = isRTL ? product.brand?.nameAr : product.brand?.name;
    const categoryName = isRTL ? product.category?.nameAr : product.category?.name;
    
    const title = `${productName}${brandName ? ` | ${brandName}` : ""} | Skinior`;
    const description = productDescription || `${productName} - Premium skincare product from Skinior`;
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skinior.com";
    const productUrl = `${baseUrl}/${locale}/products/${id}`;
    const productImage = product.images?.[0]?.url || `${baseUrl}/product-holder.webp`;

    return {
      title,
      description,
      keywords: [
        productName,
        brandName,
        categoryName,
        "skincare",
        "beauty",
        ...(product.concerns || []),
      ].filter(Boolean).join(", "),
      
      metadataBase: new URL(baseUrl),
      
      openGraph: {
        title: productName,
        description,
        url: productUrl,
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: productName,
          },
        ],
        type: "website",
        locale: locale === "ar" ? "ar_SA" : "en_US",
        siteName: "Skinior",
      },
      
      twitter: {
        card: "summary_large_image",
        title: productName,
        description,
        images: [productImage],
        site: "@skinior",
      },
      
      alternates: {
        canonical: productUrl,
        languages: {
          en: `${baseUrl}/en/products/${id}`,
          ar: `${baseUrl}/ar/products/${id}`,
        },
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
      
      other: {
        "product:price:amount": product.price?.toString() || "0",
        "product:price:currency": "JOD",
        "product:availability": product.isInStock ? "in stock" : "out of stock",
        "product:brand": brandName || "Skinior",
        "product:category": categoryName || "Skincare",
      },
    };
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return {
      title: "Product | Skinior",
      description: "Premium skincare products from Skinior",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient params={params} />;
}
