import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ImportTemplateResponse {
  success: boolean;
  data: {
    filename: string;
    contentType: string;
    buffer: string; // base64
  };
  message: string;
  timestamp: string;
}

export interface ValidationResponse {
  success: boolean;
  data: ValidationResult;
  message: string;
  timestamp: string;
}

export interface ImportResponse {
  success: boolean;
  data: ImportResult;
  message: string;
  timestamp: string;
}

export interface ImportHistoryApiResponse {
  success: boolean;
  data: ImportHistoryResponse;
  message: string;
  timestamp: string;
}
  export interface ValidationResponse {
  success: boolean;
  data: ValidationResult;
  message: string;
  timestamp: string;
}

export interface ValidationApiResponse {
  success: boolean;
  data: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    validation: {
      isValid: boolean;
      errors: ValidationError[];
      warnings: string[]; // Raw warning strings from API
    };
    preview?: any[];
  };
  message: string;
  timestamp: string;
}

export interface ValidationResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  validation: {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  };
  preview?: any[];
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ValidationWarning {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ImportResult {
  successCount: number;
  failureCount: number;
  details: ImportDetail[];
}

export interface ImportDetail {
  row: number;
  status: 'success' | 'failure';
  message?: string;
  productId?: string;
}

export interface ImportHistoryItem {
  id: string;
  fileName: string;
  status: 'pending' | 'completed' | 'failed';
  totalRows: number;
  successCount: number;
  failureCount: number;
  errors: string[];
  createdAt: Date;
  completedAt?: Date;
  userId: string;
}

export interface ImportHistoryResponse {
  items: ImportHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductImportService {
  private readonly apiUrl = 'http://localhost:4008/api/admin/products/import';

  constructor(private http: HttpClient) {}

  /**
   * Download Excel template for product import
   */
  downloadTemplate(): Observable<ImportTemplateResponse> {
    return this.http.get<ImportTemplateResponse>(`${this.apiUrl}/template`);
  }

  /**
   * Validate uploaded Excel file without importing
   */
  validateFile(file: File): Observable<ValidationResult> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ValidationApiResponse>(`${this.apiUrl}/validate`, formData)
      .pipe(map(response => {
        const data = response.data;
        
        // Transform the validation structure to match expected format
        return {
          totalRows: data.totalRows,
          validRows: data.validRows,
          invalidRows: data.invalidRows,
          validation: {
            isValid: data.validation?.isValid || false,
            errors: data.validation?.errors || [],
            warnings: (data.validation?.warnings || []).map((warning: string, index: number) => {
              // Parse warning string "Row X: message" into structured format
              const match = warning.match(/^Row (\d+): (.+)$/);
              if (match) {
                return {
                  row: parseInt(match[1]),
                  field: 'price', // Default field, could be extracted from message if needed
                  message: match[2],
                  value: null
                };
              } else {
                return {
                  row: index + 1,
                  field: 'unknown',
                  message: warning,
                  value: null
                };
              }
            })
          },
          preview: data.preview || []
        };
      }));
  }

  /**
   * Execute import after validation
   */
  executeImport(
    file: File, 
    options?: {
      skipValidation?: boolean;
      createMissingCategories?: boolean;
      createMissingBrands?: boolean;
    }
  ): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.skipValidation) {
      formData.append('skipValidation', 'true');
    }
    if (options?.createMissingCategories !== undefined) {
      formData.append('createMissingCategories', options.createMissingCategories.toString());
    }
    if (options?.createMissingBrands !== undefined) {
      formData.append('createMissingBrands', options.createMissingBrands.toString());
    }

    return this.http.post<ImportResponse>(`${this.apiUrl}/execute`, formData)
      .pipe(map(response => response.data));
  }

  /**
   * Get import history with pagination
   */
  getImportHistory(page: number = 1, limit: number = 20): Observable<ImportHistoryResponse> {
    return this.http.get<ImportHistoryApiResponse>(`${this.apiUrl}/history`, {
      params: { page: page.toString(), limit: limit.toString() }
    }).pipe(map(response => response.data));
  }

  /**
   * Helper method to download template as file
   */
  downloadTemplateFile(): void {
    this.downloadTemplate().subscribe(response => {
      if (!response.success) {
        console.error('Failed to download template:', response.message);
        return;
      }

      const { filename, contentType, buffer } = response.data;
      const binaryString = atob(buffer);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  }
}
