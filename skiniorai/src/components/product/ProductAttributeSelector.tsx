"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { type Product, type ProductAttributeValue } from "@/types/product";

interface AttributeSelection {
  [attributeName: string]: ProductAttributeValue | null;
}

interface ProductAttributeSelectorProps {
  product: Product;
  locale: string;
  onSelectionChange: (selections: AttributeSelection) => void;
  selectedAttributes?: AttributeSelection;
}

export default function ProductAttributeSelector({
  product,
  locale,
  onSelectionChange,
  selectedAttributes = {},
}: ProductAttributeSelectorProps) {
  const isRTL = locale === "ar";

  const [selections, setSelections] = useState<AttributeSelection>(selectedAttributes);

  // Calculate additional price based on selected attributes
  const additionalPrice = useMemo(() => {
    return Object.values(selections).reduce((total, selection) => {
      return total + (selection?.priceAdjustment || 0);
    }, 0);
  }, [selections]);

  // Get the total price including adjustments
  const totalPrice = useMemo(() => {
    return product.price + additionalPrice;
  }, [product.price, additionalPrice]);

  // Check if all required attributes are selected
  const isValidSelection = useMemo(() => {
    if (!product.attributes) return true;
    
    return Object.keys(product.attributes).every(attributeName => {
      return selections[attributeName] !== null && selections[attributeName] !== undefined;
    });
  }, [product.attributes, selections]);

  // Handle attribute selection
  const handleAttributeSelect = useCallback((attributeName: string, value: ProductAttributeValue) => {
    const newSelections = {
      ...selections,
      [attributeName]: value,
    };
    
    setSelections(newSelections);
    onSelectionChange(newSelections);
  }, [selections, onSelectionChange]);

  // Format price helper
  const formatPrice = (price: number) => {
    return isRTL ? `${price.toFixed(2)} د.أ` : `JOD ${price.toFixed(2)}`;
  };

  if (!product.attributes || Object.keys(product.attributes).length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Price Display with Adjustments */}
      <div className={`flex items-baseline gap-4 ${isRTL ? "flex-row-reverse justify-start" : "justify-start"}`}>
        <span className={`text-3xl font-light text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
          {formatPrice(totalPrice)}
        </span>
        {additionalPrice !== 0 && (
          <span className={`text-sm text-gray-500 ${isRTL ? "font-cairo" : ""}`}>
            {additionalPrice > 0 ? "+" : ""}{formatPrice(additionalPrice)}
          </span>
        )}
      </div>

      {/* Attribute Selectors */}
      {Object.entries(product.attributes).map(([attributeName, attributeValues]) => {
        const selectedValue = selections[attributeName];
        const attributeDisplayName = isRTL 
          ? attributeValues[0]?.attribute.nameAr || attributeName
          : attributeValues[0]?.attribute.name || attributeName;

        return (
          <div key={attributeName} className="space-y-3">
            <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <h3 className={`text-base font-semibold text-gray-900 ${isRTL ? "font-cairo" : ""}`}>
                {attributeDisplayName}
              </h3>
              {selectedValue && (
                <span className={`text-sm text-gray-600 ${isRTL ? "font-cairo" : ""}`}>
                  {isRTL ? selectedValue.valueAr : selectedValue.value}
                  {selectedValue.priceAdjustment !== 0 && (
                    <span className="ml-2">
                      ({selectedValue.priceAdjustment > 0 ? "+" : ""}{formatPrice(selectedValue.priceAdjustment)})
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* Color Selector */}
            {attributeName.toLowerCase() === "color" && (
              <div className={`flex flex-wrap gap-3 ${isRTL ? "justify-end" : "justify-start"}`}>
                {attributeValues.map((value) => {
                  const isSelected = selectedValue?.id === value.id;
                  const isOutOfStock = value.stockQuantity === 0;
                  
                  return (
                    <button
                      key={value.id}
                      onClick={() => !isOutOfStock && handleAttributeSelect(attributeName, value)}
                      disabled={isOutOfStock}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-gray-900 ring-2 ring-gray-900/20 ring-offset-2"
                          : "border-gray-300 hover:border-gray-400"
                      } ${
                        isOutOfStock
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: value.hexColor || "#f3f4f6",
                      }}
                      title={`${isRTL ? value.valueAr : value.value}${isOutOfStock ? ` (${isRTL ? "نفد المخزون" : "Out of Stock"})` : ""}`}
                    >
                      {value.image && (
                        <div
                          className="w-full h-full rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${value.image})` }}
                        />
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-0.5 bg-red-500 rotate-45"></div>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Size/Other Attribute Selector */}
            {attributeName.toLowerCase() !== "color" && (
              <div className={`flex flex-wrap gap-3 ${isRTL ? "justify-end" : "justify-start"}`}>
                {attributeValues.map((value) => {
                  const isSelected = selectedValue?.id === value.id;
                  const isOutOfStock = value.stockQuantity === 0;
                  
                  return (
                    <button
                      key={value.id}
                      onClick={() => !isOutOfStock && handleAttributeSelect(attributeName, value)}
                      disabled={isOutOfStock}
                      className={`relative px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "border-gray-900 bg-gray-900 text-white shadow-md"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      } ${
                        isOutOfStock
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:scale-105"
                      } ${isRTL ? "font-cairo" : ""}`}
                    >
                      <span>
                        {isRTL ? value.valueAr : value.value}
                      </span>
                      {value.priceAdjustment !== 0 && (
                        <span className="ml-2 text-xs opacity-75">
                          {value.priceAdjustment > 0 ? "+" : ""}{formatPrice(value.priceAdjustment)}
                        </span>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                          <span className="text-xs text-red-500 font-medium">
                            {isRTL ? "نفد" : "Out"}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Stock Information for Selected Attribute */}
            {selectedValue && selectedValue.stockQuantity > 0 && (
              <div className={`text-sm text-gray-500 ${isRTL ? "font-cairo text-right" : "text-left"}`}>
                {selectedValue.stockQuantity} {isRTL ? "قطعة متوفرة" : "units available"}
              </div>
            )}
          </div>
        );
      })}

      {/* Selection Validation Message */}
      {!isValidSelection && (
        <div className={`p-4 bg-amber-50 border border-amber-200 rounded-xl ${isRTL ? "text-right" : "text-left"}`}>
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className={`text-sm font-medium text-amber-800 ${isRTL ? "font-cairo" : ""}`}>
              {isRTL ? "يرجى اختيار جميع الخصائص المطلوبة" : "Please select all required attributes"}
            </span>
          </div>
        </div>
      )}

      {/* Summary of Selected Options */}
      {isValidSelection && Object.keys(selections).length > 0 && (
        <div className={`p-4 bg-green-50 border border-green-200 rounded-xl ${isRTL ? "text-right" : "text-left"}`}>
          <div className="space-y-2">
            <h4 className={`text-sm font-semibold text-green-800 ${isRTL ? "font-cairo" : ""}`}>
              {isRTL ? "الخصائص المختارة:" : "Selected Options:"}
            </h4>
            <div className="space-y-1">
              {Object.entries(selections).map(([attributeName, value]) => (
                value && (
                  <div key={attributeName} className={`flex items-center justify-between text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className={`text-green-700 ${isRTL ? "font-cairo" : ""}`}>
                      {isRTL ? value.attribute.nameAr : value.attribute.name}: {isRTL ? value.valueAr : value.value}
                    </span>
                    {value.priceAdjustment !== 0 && (
                      <span className={`text-green-600 font-medium ${isRTL ? "font-cairo" : ""}`}>
                        {value.priceAdjustment > 0 ? "+" : ""}{formatPrice(value.priceAdjustment)}
                      </span>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export helper functions and types
export type { AttributeSelection };
export { ProductAttributeSelector };