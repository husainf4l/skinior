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
            <h1 class="app-title apple-title-large">
              <span class="logo-icon">🧴</span>
              Skinior
            </h1>
            <p class="app-subtitle apple-caption">Product Management Dashboard</p>
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
      background: var(--apple-bg-secondary);
    }

    .app-header {
      background: var(--apple-bg-primary);
      border-bottom: 1px solid var(--apple-gray-5);
      padding: var(--apple-spacing-lg) var(--apple-spacing-lg) var(--apple-spacing-md);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo-section {
      display: flex;
      flex-direction: column;
      gap: var(--apple-spacing-xs);
    }

    .app-title {
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--apple-spacing-md);
      color: var(--apple-text-primary);
    }

    .logo-icon {
      font-size: 32px;
    }

    .app-subtitle {
      margin: 0;
      margin-left: 48px;
      color: var(--apple-text-tertiary);
    }

    .app-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--apple-spacing-lg);
    }

    @media (max-width: 768px) {
      .app-header {
        padding: var(--apple-spacing-md);
      }

      .app-title {
        font-size: 28px;
        flex-direction: column;
        text-align: center;
        gap: var(--apple-spacing-sm);
      }

      .app-subtitle {
        margin-left: 0;
        text-align: center;
      }

      .app-main {
        padding: var(--apple-spacing-md);
      }
    }
  `]
})
export class AppComponent {
  readonly title = 'skinior-admin';
}
