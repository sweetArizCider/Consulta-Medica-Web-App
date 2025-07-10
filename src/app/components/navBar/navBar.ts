import {Component, input, signal, OnInit} from '@angular/core';
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
export class NavBar implements OnInit {
  constructor(private router: Router) {}

  navItems = input<string[]>(
    ['Home', 'Clientes', 'Doctores', 'Diagnóstico', 'Farmacia', 'Recetas']
  );
  imgProfileUrl = signal<string>("");
  isUserLoggedIn = signal<boolean>(false);

  async ngOnInit(): Promise<void> {
    try {
      const user = await getCurrentUserFromToken();
      if (user) {
        this.isUserLoggedIn.set(true);
        this.imgProfileUrl.set(user.photo_profile_url || '');
      } else {
        this.isUserLoggedIn.set(false);
        this.router.navigate(['/Home']);
        this.imgProfileUrl.set('https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg');
      }
    } catch (error) {
      console.error('Error getting user:', error);
      this.isUserLoggedIn.set(false);
    }
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }

  onLogoutClick() {
    logout();
    this.isUserLoggedIn.set(false);
    this.imgProfileUrl.set('');
  }
}
