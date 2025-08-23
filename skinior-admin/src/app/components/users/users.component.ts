import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../interfaces/admin.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="users-container">
      <div class="users-header">
        <h1 class="page-title">Users Management</h1>
        <p class="page-subtitle">Manage and monitor all users in your system</p>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Search users</mat-label>
              <input matInput [(ngModel)]="searchTerm" placeholder="Search by name or email..." 
                     (keyup.enter)="loadUsers()">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Role</mat-label>
              <mat-select [(ngModel)]="selectedRole" (selectionChange)="loadUsers()">
                <mat-option value="">All Roles</mat-option>
                <mat-option value="admin">Admin</mat-option>
                <mat-option value="customer">Customer</mat-option>
                <mat-option value="agent">Agent</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="loadUsers()">
              <mat-icon>refresh</mat-icon>
              Refresh
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Users Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Users ({{ totalUsers }})</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="users" class="users-table">
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <div class="user-avatar">
                      <mat-icon>person</mat-icon>
                    </div>
                    <div class="user-details">
                      <div class="user-name">{{ getUserDisplayName(user) }}</div>
                      <div class="user-email">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [class]="'role-' + user.role">
                    {{ user.role | titlecase }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [class]="user.isActive ? 'status-active' : 'status-inactive'">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Joined</th>
                <td mat-cell *matCellDef="let user">
                  {{ user.createdAt | date:'mediumDate' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button [matMenuTriggerFor]="userMenu" 
                          [matMenuTriggerData]="{user: user}">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Paginator -->
          <mat-paginator 
            [length]="totalUsers"
            [pageSize]="pageSize"
            [pageSizeOptions]="[10, 25, 50, 100]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- User Actions Menu -->
    <mat-menu #userMenu="matMenu">
      <ng-template matMenuContent let-user="user">
        <button mat-menu-item (click)="toggleUserStatus(user)">
          <mat-icon>{{ user.isActive ? 'block' : 'check_circle' }}</mat-icon>
          <span>{{ user.isActive ? 'Deactivate' : 'Activate' }}</span>
        </button>
        <button mat-menu-item (click)="editUser(user)" *ngIf="user.role !== 'admin'">
          <mat-icon>edit</mat-icon>
          <span>Edit User</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="deleteUser(user)" class="delete-action" 
                *ngIf="user.role !== 'admin'">
          <mat-icon>delete</mat-icon>
          <span>Delete User</span>
        </button>
      </ng-template>
    </mat-menu>
  `,
  styles: [`
    .users-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .users-header {
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1e293b;
    }

    .page-subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }

    .filters-card {
      margin-bottom: 24px;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filters-row mat-form-field {
      min-width: 200px;
    }

    .table-card {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .table-container {
      overflow-x: auto;
      margin: 16px 0;
    }

    .users-table {
      width: 100%;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-weight: 600;
      color: #1e293b;
    }

    .user-email {
      font-size: 12px;
      color: #64748b;
    }

    .role-admin {
      background-color: #fecaca !important;
      color: #dc2626 !important;
    }

    .role-customer {
      background-color: #dbeafe !important;
      color: #2563eb !important;
    }

    .role-agent {
      background-color: #d1fae5 !important;
      color: #059669 !important;
    }

    .status-active {
      background-color: #dcfce7 !important;
      color: #166534 !important;
    }

    .status-inactive {
      background-color: #fee2e2 !important;
      color: #dc2626 !important;
    }

    .delete-action {
      color: #dc2626 !important;
    }

    @media (max-width: 768px) {
      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .filters-row mat-form-field {
        min-width: auto;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  users: AdminUser[] = [];
  totalUsers = 0;
  pageSize = 25;
  currentPage = 0;
  
  searchTerm = '';
  selectedRole = '';
  
  displayedColumns = ['user', 'role', 'status', 'createdAt', 'actions'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers(
      this.currentPage + 1, 
      this.pageSize, 
      this.searchTerm, 
      this.selectedRole
    ).subscribe({
      next: (response) => {
        this.users = response.data.users;
        this.totalUsers = response.data.pagination.total;
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  toggleUserStatus(user: AdminUser): void {
    const newStatus = !user.isActive;
    this.adminService.updateUser(user.id, { isActive: newStatus }).subscribe({
      next: () => {
        user.isActive = newStatus;
        this.snackBar.open(
          `User ${newStatus ? 'activated' : 'deactivated'} successfully`, 
          'Close', 
          { duration: 3000 }
        );
      },
      error: (error) => {
        console.error('Failed to update user status:', error);
        this.snackBar.open('Failed to update user status', 'Close', { duration: 3000 });
      }
    });
  }

  editUser(user: AdminUser): void {
    // TODO: Implement user edit dialog
    console.log('Edit user:', user);
    this.snackBar.open('Edit user functionality coming soon', 'Close', { duration: 3000 });
  }

  deleteUser(user: AdminUser): void {
    if (confirm(`Are you sure you want to delete user ${this.getUserDisplayName(user)}?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Failed to delete user:', error);
          this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getUserDisplayName(user: AdminUser): string {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.email.split('@')[0]; // Use email prefix as fallback
  }
}