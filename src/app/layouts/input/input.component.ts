import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() placeholder: string = '';
  @Input() icon: string = ''; 
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() disabled: boolean = false;

  get iconPath(): string {
    return `/icons/${this.icon}.svg`;
  }
}

