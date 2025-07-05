import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonType } from './button.enums';

@Component({
  selector: 'app-button', 
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() text: string = 'Click me';
  @Input() buttonType: ButtonType | string = ButtonType.Primary;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input('class') customClass: string = '';
  @Input() disabled: boolean = false;
  @Output() buttonClick = new EventEmitter<MouseEvent>();
  
  public ButtonType = ButtonType;

  onButtonClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
