import { Component } from '@angular/core';
import { ButtonComponent } from '../../layouts/button/button.component';
import {NavBar} from '../../components/navBar/navBar';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [ButtonComponent, NavBar]
})
export class LandingComponent {
  navigateToRegister() {
    window.location.href = '/register';
  }
}
