import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="analytics-container">
      <div class="page-header">
        <h1>Analytics & Reports</h1>
        <p class="page-subtitle">Comprehensive business insights and analytics</p>
      </div>

      <mat-tab-group class="analytics-tabs">
        <mat-tab label="Revenue Analytics">
          <div class="tab-content">
            <div class="coming-soon">
              <mat-icon>trending_up</mat-icon>
              <h3>Revenue Analytics</h3>
              <p>Revenue tracking, sales trends, and financial insights coming soon.</p>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Product Performance">
          <div class="tab-content">
            <div class="coming-soon">
              <mat-icon>inventory</mat-icon>
              <h3>Product Performance</h3>
              <p>Product sales analytics, top performers, and inventory insights coming soon.</p>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Customer Insights">
          <div class="tab-content">
            <div class="coming-soon">
              <mat-icon>people_alt</mat-icon>
              <h3>Customer Insights</h3>
              <p>Customer behavior, acquisition trends, and retention analytics coming soon.</p>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Marketing Reports">
          <div class="tab-content">
            <div class="coming-soon">
              <mat-icon>campaign</mat-icon>
              <h3>Marketing Reports</h3>
              <p>Campaign performance, conversion rates, and marketing ROI coming soon.</p>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .analytics-container {
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

    .analytics-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .tab-content {
      padding: 24px;
    }

    .coming-soon {
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }

    .coming-soon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #9ca3af;
    }

    .coming-soon h3 {
      margin: 0 0 8px 0;
      color: #374151;
      font-size: 20px;
    }

    .coming-soon p {
      margin: 0;
      max-width: 400px;
      margin: 0 auto;
    }
  `]
})
export class AnalyticsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}