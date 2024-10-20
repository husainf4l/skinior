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
{ name: 'Coverderm', logo: 'assets/logo/ecodenta.png' ,route: '/brand/coverderm'  },
{ name: 'Toppik',logo: 'assets/logo/logoblack.png', route: '/brand/coverderm'  },
{ name: 'Gerovital', logo: 'assets/logo/gerovital.png' , route: '/brand/coverderm' },
{ name: 'Coverderm', logo: 'assets/logo/ecodenta.png' ,route: '/brand/coverderm'  },
{ name: 'Toppik',logo: 'assets/logo/logoblack.png', route: '/brand/coverderm'  },
{ name: 'Gerovital', logo: 'assets/logo/gerovital.png' , route: '/brand/coverderm' },
{ name: 'Coverderm', logo: 'assets/logo/ecodenta.png' ,route: '/brand/coverderm'  },
{ name: 'Toppik',logo: 'assets/logo/logoblack.png', route: '/brand/coverderm'  },
{ name: 'Gerovital', logo: 'assets/logo/gerovital.png' , route: '/brand/coverderm' },



]

navigateToBrand(route: string) {
  this.router.navigate([route]);
}

}
