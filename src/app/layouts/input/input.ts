import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
  selector: "input-selector",
  template: `<input [(ngModel)]="value" (ngModelChange)="valueChange.emit(value)"/>`,
  styleUrl: "./input.css",
  imports: [FormsModule]
})

export class InputComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
}