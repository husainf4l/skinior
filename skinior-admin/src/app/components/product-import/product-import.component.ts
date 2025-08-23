import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { 
  ProductImportService, 
  ValidationResult, 
  ImportResult, 
  ImportHistoryResponse 
} from '../../services/product-import.service';

@Component({
  selector: 'app-product-import',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.css']
})
export class ProductImportComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  
  selectedFile: File | null = null;
  validationResult: ValidationResult | null = null;
  importResult: ImportResult | null = null;
  importHistory: ImportHistoryResponse | null = null;
  
  isValidating = false;
  isImporting = false;
  isLoadingHistory = false;
  
  // Import options
  skipValidation = false;
  createMissingCategories = true;
  createMissingBrands = true;
  
  // Pagination
  currentPage = 1;
  pageSize = 20;
  
  // Table columns
  historyColumns = ['fileName', 'status', 'totalRows', 'successCount', 'failureCount', 'createdAt', 'actions'];
  validationColumns = ['row', 'field', 'message', 'value'];

  constructor(
    private importService: ProductImportService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadImportHistory();
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Please select a valid Excel file (.xlsx or .xls)', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      
      this.selectedFile = file;
      this.validationResult = null;
      this.importResult = null;
    }
  }

  /**
   * Download Excel template
   */
  downloadTemplate(): void {
    this.importService.downloadTemplateFile();
    this.snackBar.open('Template download started', 'Close', { duration: 2000 });
  }

  /**
   * Validate selected file
   */
  validateFile(): void {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a file first', 'Close', { duration: 3000 });
      return;
    }

    this.isValidating = true;
    this.validationResult = null;

    this.importService.validateFile(this.selectedFile).subscribe({
      next: (result) => {
        this.validationResult = result;
        this.isValidating = false;
        
        if (result.invalidRows === 0) {
          this.snackBar.open(`Validation successful! ${result.validRows} rows ready to import`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open(`Validation completed with ${result.invalidRows} errors`, 'Close', {
            duration: 3000,
            panelClass: ['warning-snackbar']
          });
        }
      },
      error: (error) => {
        this.isValidating = false;
        this.snackBar.open('Validation failed: ' + (error.error?.message || error.message), 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Execute import
   */
  executeImport(): void {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a file first', 'Close', { duration: 3000 });
      return;
    }

    // If validation shows errors and skipValidation is false, prevent import
    if (this.validationResult && this.validationResult.invalidRows > 0 && !this.skipValidation) {
      this.snackBar.open('Please fix validation errors or enable "Skip Validation"', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.isImporting = true;
    this.importResult = null;

    const options = {
      skipValidation: this.skipValidation,
      createMissingCategories: this.createMissingCategories,
      createMissingBrands: this.createMissingBrands
    };

    this.importService.executeImport(this.selectedFile, options).subscribe({
      next: (result) => {
        this.importResult = result;
        this.isImporting = false;
        this.loadImportHistory(); // Refresh history
        
        this.snackBar.open(
          `Import completed! ${result.successCount} successful, ${result.failureCount} failed`, 
          'Close', 
          {
            duration: 5000,
            panelClass: result.failureCount === 0 ? ['success-snackbar'] : ['warning-snackbar']
          }
        );
      },
      error: (error) => {
        this.isImporting = false;
        this.snackBar.open('Import failed: ' + (error.error?.message || error.message), 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Load import history
   */
  loadImportHistory(): void {
    this.isLoadingHistory = true;
    
    this.importService.getImportHistory(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.importHistory = response;
        this.isLoadingHistory = false;
      },
      error: (error) => {
        this.isLoadingHistory = false;
        this.snackBar.open('Failed to load import history', 'Close', { duration: 3000 });
      }
    });
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadImportHistory();
  }

  /**
   * Reset form
   */
  resetForm(): void {
    this.selectedFile = null;
    this.validationResult = null;
    this.importResult = null;
    this.skipValidation = false;
    this.createMissingCategories = true;
    this.createMissingBrands = true;
    
    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /**
   * Trigger file input click
   */
  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  /**
   * Get status chip color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'primary';
      case 'failed': return 'warn';
      case 'pending': return 'accent';
      default: return '';
    }
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
  }
}
