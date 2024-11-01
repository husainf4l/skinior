import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-highlight2',
  standalone: true,
  imports: [],
  templateUrl: './highlight2.component.html',
  styleUrl: './highlight2.component.css'
})
export class Highlight2Component {
  @Input() highlight!: any;
}
