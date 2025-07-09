import { Component, input } from '@angular/core';
import { ButtonComponent } from '@layouts/button/button.component'
import { Router } from '@angular/router';

@Component({
  selector: 'nav-bar',
  templateUrl: './navBar.html',
  styleUrls: ['./navBar.scss'],
  imports: [
    ButtonComponent
  ]
})

export class NavBar {
  constructor(private router: Router) {}

  navItems = input<string[]>(
    ['Home', 'Clientes', 'Doctores', 'Diagnostico', 'Farmacia', 'Recetas']
  );
  isLoggedIn = input<boolean>(false);

  onLoginClick() {
    console.log("click")
    this.router.navigate(['/login']);
  }

  onLogoutClick() {
    console.log("logout")
    this.router.navigate(['/']);
  }
}
