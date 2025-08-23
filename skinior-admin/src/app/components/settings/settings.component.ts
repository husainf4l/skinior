import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="settings-container">
      <div class="page-header">
        <h1>Settings</h1>
        <p class="page-subtitle">Configure your admin dashboard preferences</p>
      </div>

      <div class="settings-grid">
        <!-- Account Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>account_circle</mat-icon>
              Account Settings
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="coming-soon">
              <p>Account management features coming soon.</p>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Notification Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>notifications</mat-icon>
              Notifications
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Email Notifications</h4>
                <p>Receive email updates about orders and system alerts</p>
              </div>
              <mat-slide-toggle></mat-slide-toggle>
            </div>
            <mat-divider></mat-divider>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Push Notifications</h4>
                <p>Browser push notifications for real-time updates</p>
              </div>
              <mat-slide-toggle></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- System Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>settings</mat-icon>
              System Settings
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="coming-soon">
              <p>System configuration options coming soon.</p>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Security Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>security</mat-icon>
              Security
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="coming-soon">
              <p>Security and privacy settings coming soon.</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0 0 8px 0;
    }

    .page-subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 14px;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .settings-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .settings-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
    }

    .settings-card mat-card-title mat-icon {
      color: #007AFF;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }

    .setting-info h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 500;
      color: #1d1d1f;
    }

    .setting-info p {
      margin: 0;
      font-size: 12px;
      color: #6b7280;
    }

    .coming-soon {
      text-align: center;
      padding: 40px 20px;
      color: #6b7280;
    }

    .coming-soon p {
      margin: 0;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}