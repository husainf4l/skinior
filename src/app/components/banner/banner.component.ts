import { Component } from '@angular/core';
import { Banner } from '../../services/models/interfaces.model';
import { BannerService } from '../../services/banner.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
banners:Banner[] = [];
constructor(private bannerService: BannerService) { }


ngOnInit(): void {
  this.loadBanner();
}

loadBanner() {
  this.bannerService.getBanner().subscribe(
    (banners: Banner[]) => {
      this.banners = banners;
    },
    (error) => {
      console.error('Error loading products', error);
    }
  );
}
imageLoaded: boolean[] = [];

// Handle image load event
onImageLoad(index: number): void {
  this.imageLoaded[index] = true;
}
}
