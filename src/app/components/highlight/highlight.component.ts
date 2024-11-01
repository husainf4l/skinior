import { Component } from '@angular/core';

@Component({
  selector: 'app-highlight',
  standalone: true,
  imports: [],
  templateUrl: './highlight.component.html',
  styleUrl: './highlight.component.css'
})
export class HighlightComponent {
  highlight: any = {
    image1: 'assets/images/banner/vit-c1.webp',
    alt1: 'kilig vitamin c serum image',
    image2: 'assets/images/banner/vit-c2.webp',
    alt2: 'kilig vitamin c serum image2',
    title: "Kilig Vitamin c ",
    description: "اكتشفي السر وراء الإشراقة اليومية مع تركيبة غنية بفيتامين C تعزز نضارة البشرة، تحارب علامات التعب، وتحمي من العوامل البيئية لتبدي متألقة في كل لحظة!"
  }
}
