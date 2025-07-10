import {Component, input, signal} from '@angular/core';
import { ButtonComponent } from '@layouts/button/button.component'
import { Router } from '@angular/router';
import { logout, getCurrentUserFromToken } from '@services/auth/auth.service'

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
    ['Home', 'Clientes', 'Doctores', 'Diagnóstico', 'Farmacia', 'Recetas']
  );
  isLoggedIn = input<boolean>(false);
  imgProfileUrl = signal<string>("");

  async ngOnInit(): Promise<void> {
    const photoUrl = await getCurrentUserFromToken();
    this.imgProfileUrl.set(photoUrl || '');
    console.log(photoUrl);
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }

  onLogoutClick() {
    logout();
  }
}
