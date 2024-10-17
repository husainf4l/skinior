import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-reviews.component.html',
  styleUrl: './customer-reviews.component.css'
})
export class CustomerReviewsComponent {
  reviews = [
    {
      name: 'سارة أحمد',
      status: 'عميلة راضية',
      message: 'لقد كانت تجربة التسوق في سكينير مميزة، جودة المنتجات لا يعلى عليها! أنصح بشدة.',
      image: 'https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600',
    },
    {
      name: 'ليلى خليل',
      status: 'عميلة راضية',
      message: 'منتجات العناية بالبشرة من سكينير غيرت روتيني تمامًا. أصبحت بشرتي أكثر نضارة وتألقًا.',
      image: 'https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600',
    },
    {
      name: 'مايا الحسن',
      status: 'عميلة سعيدة',
      message: 'أفضل مكياج استخدمته حتى الآن، التغطية ممتازة والخامات عالية الجودة. سأكرر الشراء بكل تأكيد.',
      image: 'https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600',
    },
    {
      name: 'سارة أحمد',
      status: 'عميلة راضية',
      message: 'لقد كانت تجربة التسوق في سكينير مميزة، جودة المنتجات لا يعلى عليها! أنصح بشدة.',
      image: 'https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600',
    },
    {
      name: 'ليلى خليل',
      status: 'عميلة راضية',
      message: 'منتجات العناية بالبشرة من سكينير غيرت روتيني تمامًا. أصبحت بشرتي أكثر نضارة وتألقًا.',
      image: 'https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600',
    },
    {
      name: 'مايا الحسن',
      status: 'عميلة سعيدة',
      message: 'أفضل مكياج استخدمته حتى الآن، التغطية ممتازة والخامات عالية الجودة. سأكرر الشراء بكل تأكيد.',
      image: 'https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600',
    },
    {
      name: 'سارة أحمد',
      status: 'عميلة راضية',
      message: 'لقد كانت تجربة التسوق في سكينير مميزة، جودة المنتجات لا يعلى عليها! أنصح بشدة.',
      image: 'https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600',
    },
    {
      name: 'ليلى خليل',
      status: 'عميلة راضية',
      message: 'منتجات العناية بالبشرة من سكينير غيرت روتيني تمامًا. أصبحت بشرتي أكثر نضارة وتألقًا.',
      image: 'https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600',
    },
    {
      name: 'مايا الحسن',
      status: 'عميلة سعيدة',
      message: 'أفضل مكياج استخدمته حتى الآن، التغطية ممتازة والخامات عالية الجودة. سأكرر الشراء بكل تأكيد.',
      image: 'https://kyliecosmetics.com/cdn/shop/files/Cosmetics_Visual-Nav-Block-Assets_lips.jpg?crop=center&height=600&v=1709151319&width=600',
    },
  ];
}
