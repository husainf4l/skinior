import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';

export interface ExcelProductRow {
  title?: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price?: number;
  compareAtPrice?: number;
  currency?: string;
  sku?: string;
  barcode?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  stockQuantity?: number;
  categoryName?: string;
  brandName?: string;
  activeIngredients?: string;
  skinType?: string;
  usage?: string;
  concerns?: string;
  features?: string;
  ingredients?: string;
  howToUse?: string;
  featuresAr?: string;
  ingredientsAr?: string;
  howToUseAr?: string;
  metaTitle?: string;
  metaDescription?: string;
  imageUrls?: string;
  // Product attributes (for variants like size, color etc.)
  attributes?: string; // JSON string or comma-separated attribute values
  [key: string]: any; // Allow additional string keys
}

export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validRows: ExcelProductRow[];
  invalidRows: { row: number; data: any; errors: string[] }[];
}

@Injectable()
export class ExcelImportService {
  /**
   * Parse Excel file and extract product data
   */
  parseExcelFile(buffer: Buffer): ExcelProductRow[] {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new BadRequestException('Excel file contains no worksheets');
      }
      
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with header row as keys
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        blankrows: false,
      }) as any[];
      
      if (jsonData.length < 2) {
        throw new BadRequestException('Excel file must contain at least a header row and one data row');
      }
      
      // Get headers and normalize them
      const headers = jsonData[0].map((header: string) => this.normalizeHeader(header));
      const dataRows = jsonData.slice(1);
      
      // Convert rows to objects
      const products: ExcelProductRow[] = dataRows
        .filter(row => row.some((cell: any) => cell !== '' && cell !== null && cell !== undefined))
        .map((row, index) => {
          const product: ExcelProductRow = {};
          
          headers.forEach((header: string, colIndex: number) => {
            const value = row[colIndex];
            if (value !== '' && value !== null && value !== undefined) {
              this.mapCellValue(product, header, value, index + 2); // +2 because we start from row 2 (after header)
            }
          });
          
          return product;
        });
      
      return products;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to parse Excel file: ${error.message}`);
    }
  }
  
  /**
   * Validate parsed product data
   */
  validateProducts(products: ExcelProductRow[]): ImportValidationResult {
    const result: ImportValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      validRows: [],
      invalidRows: [],
    };
    
    if (products.length === 0) {
      result.isValid = false;
      result.errors.push('No valid product data found in the Excel file');
      return result;
    }
    
    products.forEach((product, index) => {
      const rowNumber = index + 2; // Excel row number (accounting for header)
      const rowErrors: string[] = [];
      const rowWarnings: string[] = [];
      
      // Required fields validation
      if (!product.title || product.title.trim() === '') {
        rowErrors.push(`Row ${rowNumber}: Title is required`);
      }
      
      if (product.price === undefined || product.price === null || isNaN(product.price)) {
        rowErrors.push(`Row ${rowNumber}: Valid price is required`);
      } else if (product.price < 0) {
        rowErrors.push(`Row ${rowNumber}: Price cannot be negative`);
      }
      
      // Optional field validation
      if (product.compareAtPrice !== undefined && product.compareAtPrice !== null && !isNaN(product.compareAtPrice)) {
        if (product.compareAtPrice < 0) {
          rowErrors.push(`Row ${rowNumber}: Compare at price cannot be negative`);
        }
        if (product.price && product.compareAtPrice > 0 && product.compareAtPrice <= product.price) {
          rowWarnings.push(`Row ${rowNumber}: Compare at price should be higher than regular price`);
        }
      }
      
      if (product.stockQuantity !== undefined && !isNaN(product.stockQuantity)) {
        if (product.stockQuantity < 0) {
          rowErrors.push(`Row ${rowNumber}: Stock quantity cannot be negative`);
        }
      }
      
      // Email/SKU format validation
      if (product.sku && product.sku.length > 100) {
        rowWarnings.push(`Row ${rowNumber}: SKU is very long, consider shortening it`);
      }
      
      if (product.barcode && product.barcode.length > 50) {
        rowWarnings.push(`Row ${rowNumber}: Barcode is very long, consider shortening it`);
      }
      
      // Currency validation
      if (product.currency && !['USD', 'JOD', 'EUR', 'SAR'].includes(product.currency.toUpperCase())) {
        rowWarnings.push(`Row ${rowNumber}: Currency '${product.currency}' may not be supported`);
      }
      
      if (rowErrors.length > 0) {
        result.isValid = false;
        result.invalidRows.push({
          row: rowNumber,
          data: product,
          errors: rowErrors,
        });
        result.errors.push(...rowErrors);
      } else {
        result.validRows.push(product);
      }
      
      if (rowWarnings.length > 0) {
        result.warnings.push(...rowWarnings);
      }
    });
    
    return result;
  }
  
  /**
   * Generate Excel template for product import
   */
  generateTemplate(): Buffer {
    const headers = [
      'Title*',                    // maps to: title
      'Title (Arabic)',           // maps to: titleAr
      'Description (English)',    // maps to: descriptionEn
      'Description (Arabic)',     // maps to: descriptionAr
      'Price*',                   // maps to: price
      'Compare At Price',         // maps to: compareAtPrice
      'Currency',                 // maps to: currency
      'SKU',                      // maps to: sku
      'Barcode',                  // maps to: barcode
      'Is Active',                // maps to: isActive
      'Is Featured',              // maps to: isFeatured
      'Is New',                   // maps to: isNew
      'Stock Quantity',           // maps to: stockQuantity
      'Category Name',            // maps to: categoryName
      'Brand Name',               // maps to: brandName
      'Active Ingredients',       // maps to: activeIngredients
      'Skin Type',                // maps to: skinType
      'Usage',                    // maps to: usage
      'Concerns',                 // maps to: concerns
      'Features',                 // maps to: features
      'Ingredients',              // maps to: ingredients
      'How To Use',               // maps to: howToUse
      'Features (Arabic)',        // maps to: featuresAr
      'Ingredients (Arabic)',     // maps to: ingredientsAr
      'How To Use (Arabic)',      // maps to: howToUseAr
      'Meta Title',               // maps to: metaTitle
      'Meta Description',         // maps to: metaDescription
      'Image URLs',               // maps to: imageUrls
      'Attributes',               // maps to: attributes
    ];
    
    const sampleData = [
      [
        // English product example
        'Vitamin C Brightening Serum',                                      // Title*
        'سيروم فيتامين سي المضيء',                                           // Title (Arabic)
        'A powerful vitamin C serum that brightens and evens skin tone',    // Description (English)
        'سيروم فيتامين سي قوي يضيء ويوحد لون البشرة ويمنحها إشراقاً طبيعياً',  // Description (Arabic)
        45.99,                                                              // Price*
        59.99,                                                              // Compare At Price
        'JOD',                                                              // Currency
        'VCS001',                                                           // SKU
        '1234567890123',                                                    // Barcode
        'TRUE',                                                             // Is Active
        'TRUE',                                                             // Is Featured
        'FALSE',                                                            // Is New
        100,                                                                // Stock Quantity
        'Serums',                                                           // Category Name
        'The Ordinary',                                                     // Brand Name
        '25% Vitamin C, Hyaluronic Acid',                                  // Active Ingredients
        'All skin types',                                                   // Skin Type
        'Morning',                                                          // Usage
        'Dark spots, Dullness, Fine lines',                                // Concerns
        'Brightening, Anti-aging, Hydrating',                              // Features
        'Vitamin C, Water, Glycerin, Hyaluronic Acid',                     // Ingredients
        'Apply 2-3 drops to clean skin in the morning',                    // How To Use
        'مضيء، مضاد للشيخوخة، مرطب',                                        // Features (Arabic)
        'فيتامين سي، ماء، جليسرين، حمض الهيالورونيك',                        // Ingredients (Arabic)
        'ضع 2-3 قطرات على البشرة النظيفة في الصباح',                       // How To Use (Arabic)
        'Best Vitamin C Serum for Brightening',                            // Meta Title
        'Shop our best-selling vitamin C serum for brighter, more even skin tone', // Meta Description
        'https://example.com/image1.jpg, https://example.com/image2.jpg',  // Image URLs
        'Size:30ml, Type:Serum',                                           // Attributes
      ],
      [
        // Arabic product example
        'Retinol Night Cream',                                             // Title*
        'كريم الريتينول الليلي المغذي',                                     // Title (Arabic)
        'Anti-aging night cream with retinol for smoother, firmer skin',   // Description (English)
        'كريم ليلي مضاد للشيخوخة مع الريتينول لبشرة أكثر نعومة وثباتاً',      // Description (Arabic)
        38.50,                                                             // Price*
        45.00,                                                             // Compare At Price
        'JOD',                                                             // Currency
        'RNC002',                                                          // SKU
        '9876543210987',                                                   // Barcode
        'TRUE',                                                            // Is Active
        'FALSE',                                                           // Is Featured
        'TRUE',                                                            // Is New
        75,                                                                // Stock Quantity
        'Moisturizers',                                                    // Category Name
        'CeraVe',                                                          // Brand Name
        '1% Retinol, Ceramides, Niacinamide',                            // Active Ingredients
        'Normal to dry skin',                                             // Skin Type
        'Night',                                                          // Usage
        'Wrinkles, Fine lines, Uneven texture',                          // Concerns
        'Anti-aging, Smoothing, Firming, Moisturizing',                  // Features
        'Retinol, Ceramides, Niacinamide, Shea Butter',                  // Ingredients
        'Apply to face and neck before bed, start 2-3 times per week',   // How To Use
        'مضاد للشيخوخة، تنعيم، شد، ترطيب',                               // Features (Arabic)
        'ريتينول، سيراميد، نياسيناميد، زبدة الشيا',                        // Ingredients (Arabic)
        'يُطبق على الوجه والرقبة قبل النوم، ابدأ 2-3 مرات أسبوعياً',       // How To Use (Arabic)
        'Best Retinol Night Cream for Anti-Aging',                       // Meta Title
        'Transform your skin overnight with our gentle retinol cream for visible anti-aging results', // Meta Description
        'https://example.com/retinol1.jpg, https://example.com/retinol2.jpg', // Image URLs
        'Size:50ml, Type:Cream, Texture:Rich',                           // Attributes
      ],
    ];
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    
    // Set column widths
    const colWidths = headers.map(() => ({ width: 20 }));
    worksheet['!cols'] = colWidths;
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    // Add instructions sheet
    const instructionsData = [
      ['Excel Import Instructions'],
      [''],
      ['Required Fields (marked with *):'],
      ['- Title: Product name in English'],
      ['- Price: Product price (number format)'],
      [''],
      ['Optional Fields:'],
      ['- All other fields are optional but recommended'],
      ['- Compare At Price: Leave empty if no discount, otherwise must be higher than regular price'],
      ['- Boolean fields: Use TRUE/FALSE or 1/0'],
      ['- Image URLs: Separate multiple URLs with commas'],
      ['- Features/Concerns: Separate multiple items with commas'],
      ['- Attributes: Format as "Name:Value, Name:Value" (e.g., "Size:30ml, Color:Blue")'],
      [''],
      ['Data Format Guidelines:'],
      ['- Use consistent currency codes (USD, JOD, EUR, SAR)'],
      ['- Stock quantities should be whole numbers'],
      ['- SKUs and Barcodes should be unique'],
      ['- Categories and Brands will be created if they don\'t exist'],
      ['- Product attributes will be created automatically from the Attributes field'],
      [''],
      ['New Fields Added:'],
      ['- Barcode: Product barcode for inventory management'],
      ['- Concerns: Skin concerns this product addresses (comma-separated)'],
      ['- Attributes: Product variants like size, color, type (format: "Name:Value, Name:Value")'],
      [''],
      ['Tips:'],
      ['- Remove empty rows before importing'],
      ['- Ensure data types match expected formats'],
      ['- Test with a small batch first'],
      ['- Check the validation results carefully'],
      ['- Use consistent naming for attributes across products'],
    ];
    
    const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');
    
    // Generate buffer
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
  
  /**
   * Normalize header names to match expected fields
   */
  private normalizeHeader(header: string): string {
    if (!header || typeof header !== 'string') return '';
    
    // Remove asterisks, parentheses, and normalize spaces
    const normalized = header.toLowerCase().trim()
      .replace(/[*\(\)]/g, '')
      .replace(/\s+/g, '')
      .replace(/-/g, '');
    
    const headerMap: { [key: string]: string } = {
      // Basic fields
      'title': 'title',
      'titlearabic': 'titleAr',
      'titleinarabic': 'titleAr',
      
      // Description fields
      'descriptionenglish': 'descriptionEn',
      'description': 'descriptionEn',
      'descriptionen': 'descriptionEn',
      'descriptionarabic': 'descriptionAr',
      'descriptionar': 'descriptionAr',
      
      // Price fields
      'price': 'price',
      'compareatprice': 'compareAtPrice',
      'compareprice': 'compareAtPrice',
      'currency': 'currency',
      
      // Product identifiers
      'sku': 'sku',
      'barcode': 'barcode',
      
      // Boolean flags
      'isactive': 'isActive',
      'active': 'isActive',
      'isfeatured': 'isFeatured',
      'featured': 'isFeatured',
      'isnew': 'isNew',
      'new': 'isNew',
      
      // Inventory
      'stockquantity': 'stockQuantity',
      'stock': 'stockQuantity',
      'quantity': 'stockQuantity',
      
      // Category and Brand
      'categoryname': 'categoryName',
      'category': 'categoryName',
      'brandname': 'brandName',
      'brand': 'brandName',
      
      // Skincare specific
      'activeingredients': 'activeIngredients',
      'skintype': 'skinType',
      'usage': 'usage',
      'concerns': 'concerns',
      
      // Product details
      'features': 'features',
      'ingredients': 'ingredients',
      'ingredientslist': 'ingredients',
      'howtouse': 'howToUse',
      
      // Arabic versions
      'featuresarabic': 'featuresAr',
      'featuresar': 'featuresAr',
      'ingredientsarabic': 'ingredientsAr',
      'ingredientsar': 'ingredientsAr',
      'howtousearabic': 'howToUseAr',
      'howtousear': 'howToUseAr',
      
      // SEO fields
      'metatitle': 'metaTitle',
      'metadescription': 'metaDescription',
      
      // Media and variants
      'imageurls': 'imageUrls',
      'images': 'imageUrls',
      'attributes': 'attributes',
    };
    
    const mapped = headerMap[normalized];
    if (mapped) {
      return mapped;
    }
    
    // Debug logging for unmapped headers
    console.log(`⚠️  Unmapped header: "${header}" -> normalized: "${normalized}"`);
    return normalized;
  }
  
  /**
   * Map cell value to product property with type conversion
   */
  private mapCellValue(product: ExcelProductRow, header: string, value: any, rowNumber: number): void {
    if (value === '' || value === null || value === undefined) return;
    
    try {
      switch (header) {
        case 'price':
          const priceValue = typeof value === 'number' ? value : parseFloat(value);
          if (!isNaN(priceValue)) {
            product[header] = priceValue;
          }
          break;
          
        case 'compareAtPrice':
          const compareValue = typeof value === 'number' ? value : parseFloat(value);
          if (!isNaN(compareValue) && compareValue >= 0) {
            product[header] = compareValue;
          }
          break;
          
        case 'stockQuantity':
          const numValue = typeof value === 'number' ? value : parseFloat(value);
          if (!isNaN(numValue) && numValue > 0) {
            product[header] = numValue;
          }
          break;
          
        case 'isActive':
        case 'isFeatured':
        case 'isNew':
          const boolValue = this.parseBooleanValue(value);
          if (boolValue !== null) {
            product[header] = boolValue;
          }
          break;
          
        case 'features':
        case 'concerns':
        case 'imageUrls':
        case 'attributes':
          // Convert comma-separated strings to arrays
          if (typeof value === 'string') {
            const arrayValue = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
            if (arrayValue.length > 0) {
              product[header] = arrayValue.join(', ');
            }
          } else {
            product[header] = String(value);
          }
          break;
          
        default:
          // String fields
          product[header as keyof ExcelProductRow] = String(value).trim();
          break;
      }
    } catch (error) {
      console.warn(`Error mapping value for ${header} in row ${rowNumber}:`, error);
    }
  }
  
  /**
   * Parse boolean values from various formats
   */
  private parseBooleanValue(value: any): boolean | null {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      if (['true', '1', 'yes', 'y', 'on'].includes(lowerValue)) return true;
      if (['false', '0', 'no', 'n', 'off'].includes(lowerValue)) return false;
    }
    return null;
  }
}