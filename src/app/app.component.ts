import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./layout/footer/footer.component";
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { filter, map, mergeMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MetaService } from './services/meta.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        const { title, description, keywords = [], image = '' } = data;
        this.metaService.updateMetaData(title, description, keywords, image);
      });
  }
}
