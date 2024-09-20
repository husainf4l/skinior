import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleTransformPime } from '../title.transform.pipe';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [CommonModule, TitleTransformPime, RouterLink],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.css'
})
export class SubCategoryComponent implements OnInit {
  public href: string = "";
  subCategory: any;
  subProducts: any;
  routeName: any
  constructor(private activeRoute: ActivatedRoute,
    public productService: ProductService
  ) { }
  ngOnInit(): void {
    this.activeRoute.params.subscribe(
      (data: any) => {
        console.log('data', data['id']),
          this.productService.getProducts().subscribe(
            products => {
              console.log('products', products)
              this.subProducts = products
            }
          )
      }
    )

  }

}
