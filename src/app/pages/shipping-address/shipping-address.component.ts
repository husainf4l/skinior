import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class ShippingAddressComponent implements OnInit {
  name: string = '';
  address: string = '';
  mobile: string = '';
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cartItems = JSON.parse(params['cart'] || '[]');
      this.totalPrice = +params['totalPrice'] || 0;
    });
  }

  submitShippingAddress(): void {
    if (this.name && this.address && this.mobile) {
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        this.orderService.createOrder(cartId, this.address, this.mobile, this.name).subscribe(
          response => {
            const orderId = response.id;
            this.router.navigate(['/order-details', orderId]);
          },
          error => {
            alert('Failed to confirm the order. Please try again.');
          }
        );
      } else {
        alert('Cart not found. Please try again.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  }

}
