import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands-showcase',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brands-showcase.component.html',
  styleUrl: './brands-showcase.component.css'
})
export class BrandsShowcaseComponent {
  constructor(private router: Router) {}


  brands:any[] = [
{ name: 'Coverderm', logo: 'assets/logo/coverderm.webp' ,route: '/brand/coverderm'  },
{ name: 'Toppik',logo: 'assets/logo/toppik.webp', route: '/brand/toppik'  },
{ name: 'Gerovital', logo: 'assets/logo/gerovital.webp' , route: '/brand/gerovital' },
{ name: 'Ecodenta', logo: 'assets/logo/ecodenta.webp' ,route: '/brand/ecodenta'  },
{ name: 'Dentrax', logo: 'assets/logo/dentrax.webp' ,route: '/brand/dentrax'  },
{ name: 'HFS', logo: 'assets/logo/hfs.webp' , route: '/brand/hfs' },
{ name: 'Kili.g', logo: 'assets/logo/kilig.webp' ,route: '/brand/kilig'  },






]

navigateToBrand(route: string) {
  this.router.navigate([route]);
}

}
