import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-highlight3',
  standalone: true,
  imports: [],
  templateUrl: './highlight3.component.html',
  styleUrl: './highlight3.component.css'
})
export class Highlight3Component {
  @Input() highlight!: any;

}
