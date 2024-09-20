import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthorizedPosService } from '../../services/authorized-pos.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-authorized',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css'
})
export class AuthorizedComponent {
  places: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  searchQuery: string = '';


  constructor(private authorizedPosService: AuthorizedPosService) { }

  ngOnInit(): void {
    this.fetchPointsOfSale();
  }

  fetchPointsOfSale() {
    this.authorizedPosService.getAuthorizedPointsOfSale(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe((data) => {
        this.places = data.items;
        this.totalItems = data.totalItems;
      });
  }

  onSearch() {
    this.currentPage = 1;  // Reset to first page on new search
    this.fetchPointsOfSale();
  }


  get paginatedPlaces() {
    return this.places;
  }

  nextPage() {
    this.currentPage++;
    this.fetchPointsOfSale();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchPointsOfSale();
    }
  }
}

