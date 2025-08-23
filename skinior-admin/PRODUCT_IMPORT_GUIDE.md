# Product Import Feature - Quick Start Guide

## Overview

The Product Import feature allows administrators to bulk import products using Excel files. The implementation includes:

1. **Template Download** - Get the correct Excel format
2. **File Validation** - Check for errors before importing
3. **Bulk Import** - Import products with customizable options
4. **Import History** - Track all import operations

## API Endpoints Used

### Download Template

- **Method**: GET
- **Path**: `/admin/products/import/template`
- **Auth**: Admin Bearer Token
- **Response**:

```json
{
  "success": true,
  "data": {
    "filename": "products_import_template.xlsx",
    "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "buffer": "UEsDBBQAAAAAAAAAAADxYTwnQgMAAEIDAAAaAAAA..." // base64 Excel file
  },
  "message": "Template generated successfully",
  "timestamp": "2025-08-22T17:45:17.287Z"
}
```

### Validate File

- **Method**: POST
- **Path**: `/admin/products/import/validate`
- **Auth**: Admin Bearer Token
- **Content-Type**: multipart/form-data
- **Body**: `file` (Excel .xlsx/.xls)
- **Response**:

```json
{
  "success": true,
  "data": {
    "totalRows": 100,
    "validRows": 95,
    "invalidRows": 5,
    "errors": [
      {
        "row": 10,
        "field": "price",
        "message": "Price must be a positive number",
        "value": "-5.99"
      }
    ],
    "warnings": [],
    "preview": []
  },
  "message": "Validation completed",
  "timestamp": "2025-08-22T17:45:17.287Z"
}
```

### Execute Import

- **Method**: POST
- **Path**: `/admin/products/import/execute`
- **Auth**: Admin Bearer Token
- **Content-Type**: multipart/form-data
- **Body**:
  - `file` (Excel file) - required
  - `skipValidation` (boolean) - optional
  - `createMissingCategories` (boolean) - optional, default true
  - `createMissingBrands` (boolean) - optional, default true
- **Response**:

```json
{
  "success": true,
  "data": {
    "successCount": 95,
    "failureCount": 5,
    "details": [
      {
        "row": 10,
        "status": "failure",
        "message": "Invalid price format",
        "productId": null
      }
    ]
  },
  "message": "Import completed",
  "timestamp": "2025-08-22T17:45:17.287Z"
}
```

### Import History

- **Method**: GET
- **Path**: `/admin/products/import/history`
- **Auth**: Admin Bearer Token
- **Query Params**: `page` (default 1), `limit` (default 20)
- **Response**:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "import_123",
        "fileName": "products_batch_1.xlsx",
        "status": "completed",
        "totalRows": 100,
        "successCount": 95,
        "failureCount": 5,
        "errors": ["Row 10: Invalid price format"],
        "createdAt": "2025-08-22T17:45:17.287Z",
        "completedAt": "2025-08-22T17:46:17.287Z",
        "userId": "user_123"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  },
  "message": "History retrieved successfully",
  "timestamp": "2025-08-22T17:45:17.287Z"
}
```

## Navigation

The import feature is accessible via:

- Main navigation: Products → Import Products
- Direct URL: `/products/import`

## Excel Template Structure

The downloaded template includes the following columns:

### Required Fields (marked with *)
- **Title*** - Product name in English
- **Price*** - Product price (numeric format)

### Optional Fields
- **Title (Arabic)** - Product name in Arabic
- **Description (English)** - Product description in English
- **Description (Arabic)** - Product description in Arabic
- **Compare At Price** - Original/MSRP price for discount display
- **Currency** - Currency code (USD, JOD, EUR, SAR)
- **SKU** - Stock Keeping Unit identifier
- **Barcode** - Product barcode/EAN/UPC
- **Is Active** - TRUE/FALSE or 1/0
- **Is Featured** - TRUE/FALSE or 1/0
- **Is New** - TRUE/FALSE or 1/0
- **Stock Quantity** - Available stock (whole number)
- **Category Name** - Product category (will be created if doesn't exist)
- **Brand Name** - Product brand (will be created if doesn't exist)
- **Active Ingredients** - Key active ingredients
- **Skin Type** - Target skin types (All skin types, Dry, Oily, etc.)
- **Usage** - When to use (Morning, Night, Daily, etc.)
- **Features** - Comma-separated benefits (e.g., "Brightening, Anti-aging, Hydrating")
- **Ingredients** - Full ingredient list
- **How To Use** - Usage instructions
- **Features (Arabic)** - Arabic translation of features
- **Ingredients (Arabic)** - Arabic translation of ingredients
- **How To Use (Arabic)** - Arabic translation of usage instructions
- **Meta Title** - SEO meta title
- **Meta Description** - SEO meta description
- **Concerns** - Comma-separated skin concerns addressed
- **Image URLs** - Comma-separated image URLs

### Data Format Guidelines
- Use consistent currency codes (USD, JOD, EUR, SAR)
- Stock quantities should be whole numbers
- SKUs should be unique
- Categories and Brands will be created if they don't exist
- Boolean fields: Use TRUE/FALSE or 1/0
- Multiple values: Separate with commas (Features, Concerns, Image URLs)
- Remove empty rows before importing

## Components Created

### 1. ProductImportService

- **File**: `src/app/services/product-import.service.ts`
- **Purpose**: API communication for import operations
- **Key Methods**:
  - `downloadTemplate()` - Get Excel template
  - `validateFile(file)` - Validate before import
  - `executeImport(file, options)` - Execute import
  - `getImportHistory(page, limit)` - Get import history

### 2. ProductImportComponent

- **File**: `src/app/components/product-import/product-import.component.ts`
- **Template**: `src/app/components/product-import/product-import.component.html`
- **Styles**: `src/app/components/product-import/product-import.component.css`
- **Purpose**: Main UI for import workflow

## Features

### Step-by-Step Import Process

1. **Download Template**: Get properly formatted Excel file
2. **Upload File**: Select .xlsx or .xls file
3. **Validate**: Check for errors and warnings
4. **Configure Options**: Set import preferences
5. **Execute**: Run the import process

### Import Options

- **Skip Validation**: Import even if validation fails
- **Create Missing Categories**: Auto-create categories not in database
- **Create Missing Brands**: Auto-create brands not in database

### Validation Features

- Row-by-row error reporting
- Field-specific error messages
- Warning system for non-critical issues
- Preview of data to be imported

### History Tracking

- All import operations logged
- Status tracking (pending/completed/failed)
- Success/failure counts
- Error details for failed imports

## Usage Instructions

1. **Access the Import Page**

   - Navigate to Products → Import Products in the admin panel

2. **Download Template**

   - Click "Download Template" to get the Excel format
   - Fill in your product data following the template structure

3. **Upload and Validate**

   - Select your completed Excel file
   - Click "Validate File" to check for errors
   - Review any errors or warnings displayed

4. **Configure Import Options**

   - Choose whether to skip validation (if errors exist)
   - Set category/brand creation preferences

5. **Execute Import**

   - Click "Start Import" to begin the process
   - Monitor progress and review results

6. **View History**
   - Switch to "Import History" tab to see past imports
   - Check success/failure rates and error details

## Development Notes

- Uses Angular Material for UI components
- Standalone components with lazy loading
- Reactive forms with real-time validation
- File upload with drag-and-drop support
- Progress indicators for long-running operations
- Responsive design for mobile/desktop

## Testing the Implementation

1. Start the dev server: `pm2 start npm --name skinior-admin --watch -- start`
2. Navigate to `http://localhost:4200/products/import`
3. Test each step of the import workflow
4. Verify error handling and validation feedback

## Next Steps

To complete the implementation:

1. Ensure backend API endpoints match the expected interface
2. Add authentication headers to service requests
3. Test with real Excel files and data
4. Add more detailed error handling
5. Implement file size limits and validation
