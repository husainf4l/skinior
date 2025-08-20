import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <h1 class="app-title">
              <span class="logo-icon">🛍️</span>
              Skinior Admin
            </h1>
            <p class="app-subtitle">Product Management Dashboard</p>
          </div>
        </div>
      </header>
      
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #fafafa;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 24px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .app-title {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 2rem;
      font-weight: 700;
    }

    .logo-icon {
      font-size: 2.5rem;
    }

    .app-subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
      font-weight: 400;
      margin-left: 60px;
    }

    .app-main {
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 16px;
      }

      .app-title {
        font-size: 1.5rem;
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }

      .app-subtitle {
        margin-left: 0;
        text-align: center;
      }

      .app-main {
        padding: 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'skinior-admin';
}
