import { Routes } from '@angular/router';
import { LoginView } from '../views/login/login.view';
import { RegisterView } from '../views/register/register.view';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginView
  },
  {
    path: 'register',
    component: RegisterView
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
