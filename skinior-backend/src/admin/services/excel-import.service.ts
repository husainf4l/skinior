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
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  stockQuantity?: number;
  categoryName?: string;
  brandName?: string;
  activeIngredients?: string;
  skinType?: string;
  usage?: string;
  features?: string;
  ingredients?: string;
  howToUse?: string;
  featuresAr?: string;
  ingredientsAr?: string;
  howToUseAr?: string;
  metaTitle?: string;
  metaDescription?: string;
  concerns?: string;
  imageUrls?: string;
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
      if (product.compareAtPrice !== undefined && !isNaN(product.compareAtPrice)) {
        if (product.compareAtPrice < 0) {
          rowErrors.push(`Row ${rowNumber}: Compare at price cannot be negative`);
        }
        if (product.price && product.compareAtPrice <= product.price) {
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
      'Title*',
      'Title (Arabic)',
      'Description (English)',
      'Description (Arabic)',
      'Price*',
      'Compare At Price',
      'Currency',
      'SKU',
      'Is Active',
      'Is Featured',
      'Is New',
      'Stock Quantity',
      'Category Name',
      'Brand Name',
      'Active Ingredients',
      'Skin Type',
      'Usage',
      'Features',
      'Ingredients',
      'How To Use',
      'Features (Arabic)',
      'Ingredients (Arabic)',
      'How To Use (Arabic)',
      'Meta Title',
      'Meta Description',
      'Concerns',
      'Image URLs',
    ];
    
    const sampleData = [
      [
        'Vitamin C Brightening Serum',
        'سيروم فيتامين سي المضيء',
        'A powerful vitamin C serum that brightens and evens skin tone',
        'سيروم فيتامين سي قوي يضيء ويوحد لون البشرة',
        45.99,
        59.99,
        'JOD',
        'VCS001',
        'TRUE',
        'TRUE',
        'FALSE',
        100,
        'Serums',
        'The Ordinary',
        '25% Vitamin C, Hyaluronic Acid',
        'All skin types',
        'Morning',
        'Brightening, Anti-aging, Hydrating',
        'Vitamin C, Water, Glycerin',
        'Apply 2-3 drops to clean skin in the morning',
        'مضيء، مضاد للشيخوخة، مرطب',
        'فيتامين سي، ماء، جليسرين',
        'ضع 2-3 قطرات على البشرة النظيفة في الصباح',
        'Best Vitamin C Serum for Brightening',
        'Shop our best-selling vitamin C serum for brighter, more even skin tone',
        'Dark spots, Dullness, Fine lines',
        'https://example.com/image1.jpg, https://example.com/image2.jpg',
      ],
      [
        'Retinol Night Cream',
        'كريم الريتينول الليلي',
        'Anti-aging night cream with retinol',
        'كريم ليلي مضاد للشيخوخة مع الريتينول',
        38.50,
        '',
        'JOD',
        'RNC002',
        'TRUE',
        'FALSE',
        'TRUE',
        75,
        'Moisturizers',
        'CeraVe',
        '1% Retinol, Ceramides',
        'Normal to dry skin',
        'Night',
        'Anti-aging, Smoothing, Firming',
        'Retinol, Ceramides, Niacinamide',
        'Apply to face and neck before bed',
        'مضاد للشيخوخة، تنعيم، شد',
        'ريتينول، سيراميد، نياسيناميد',
        'يُطبق على الوجه والرقبة قبل النوم',
        'Best Retinol Night Cream',
        'Transform your skin overnight with our gentle retinol cream',
        'Wrinkles, Fine lines, Uneven texture',
        'https://example.com/retinol1.jpg',
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
      ['- Boolean fields: Use TRUE/FALSE or 1/0'],
      ['- Image URLs: Separate multiple URLs with commas'],
      ['- Features/Concerns: Separate multiple items with commas'],
      [''],
      ['Data Format Guidelines:'],
      ['- Use consistent currency codes (USD, JOD, EUR, SAR)'],
      ['- Stock quantities should be whole numbers'],
      ['- SKUs should be unique'],
      ['- Categories and Brands will be created if they don\'t exist'],
      [''],
      ['Tips:'],
      ['- Remove empty rows before importing'],
      ['- Ensure data types match expected formats'],
      ['- Test with a small batch first'],
      ['- Check the validation results carefully'],
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
    
    const normalized = header.toLowerCase().trim().replace(/[*\s]/g, '');
    
    const headerMap: { [key: string]: string } = {
      'title': 'title',
      'titlearabic': 'titleAr',
      'titleinarabic': 'titleAr',
      'descriptionenglish': 'descriptionEn',
      'description': 'descriptionEn',
      'descriptionen': 'descriptionEn',
      'descriptionarabic': 'descriptionAr',
      'descriptionar': 'descriptionAr',
      'price': 'price',
      'compareatprice': 'compareAtPrice',
      'compareprice': 'compareAtPrice',
      'currency': 'currency',
      'sku': 'sku',
      'isactive': 'isActive',
      'active': 'isActive',
      'isfeatured': 'isFeatured',
      'featured': 'isFeatured',
      'isnew': 'isNew',
      'new': 'isNew',
      'stockquantity': 'stockQuantity',
      'stock': 'stockQuantity',
      'quantity': 'stockQuantity',
      'categoryname': 'categoryName',
      'category': 'categoryName',
      'brandname': 'brandName',
      'brand': 'brandName',
      'activeingredients': 'activeIngredients',
      'ingredients': 'activeIngredients',
      'skintype': 'skinType',
      'usage': 'usage',
      'features': 'features',
      'ingredientslist': 'ingredients',
      'howtouse': 'howToUse',
      'featuresarabic': 'featuresAr',
      'featuresar': 'featuresAr',
      'ingredientsarabic': 'ingredientsAr',
      'ingredientsar': 'ingredientsAr',
      'howtousearabic': 'howToUseAr',
      'howtousear': 'howToUseAr',
      'metatitle': 'metaTitle',
      'metadescription': 'metaDescription',
      'concerns': 'concerns',
      'imageurls': 'imageUrls',
      'images': 'imageUrls',
    };
    
    return headerMap[normalized] || normalized;
  }
  
  /**
   * Map cell value to product property with type conversion
   */
  private mapCellValue(product: ExcelProductRow, header: string, value: any, rowNumber: number): void {
    if (value === '' || value === null || value === undefined) return;
    
    try {
      switch (header) {
        case 'price':
        case 'compareAtPrice':
        case 'stockQuantity':
          const numValue = typeof value === 'number' ? value : parseFloat(value);
          if (!isNaN(numValue)) {
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