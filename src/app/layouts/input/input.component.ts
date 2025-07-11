import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() options: { label: string; value: string | number }[] = [];
  @Output() input = new EventEmitter<Event>();

  get iconPath(): string {
    return `/icons/${this.icon}.svg`;
  }

  get isMaterialIcon(): boolean {
    // Explicitly convert to boolean using !!
    return !!(this.icon && !this.icon.includes('.svg') && !this.icon.includes('/'));
  }

  onInput(event: Event): void {
    this.input.emit(event);
  }
}
