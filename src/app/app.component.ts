// app.component.ts

import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, Event as RouterEvent } from '@angular/router';
import { FooterComponent } from "./layout/footer/footer.component";
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

function isNavigationEnd(event: RouterEvent): event is NavigationEnd {
  return event instanceof NavigationEnd;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected property name
})
export class AppComponent {
  title = 'skinior';
  showUserLayout = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(isNavigationEnd) 
      )
      .subscribe((event: NavigationEnd) => {
        this.showUserLayout = !event.url.startsWith('/admin');
      });
  }
}
