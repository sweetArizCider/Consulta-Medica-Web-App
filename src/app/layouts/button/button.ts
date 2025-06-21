import { Component, input } from "@angular/core";

@Component({
  selector: "button-selector",
  template: `<button>{{ label() }}</button>`,
  styleUrl: "./button.css",
})

export class ButtonComponent {
  label = input<string>("Button Label");
}