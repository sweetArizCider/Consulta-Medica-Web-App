import { Routes } from '@angular/router';
import { LoginView } from '@views/login/login.view';
import { RegisterView } from '@views/register/register.view';
import { LandingComponent } from '@views/landing/landing.component';
import { ClientsView } from '@views/clients/clients.view';

export const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'login', component: LoginView },
  { path: 'register', component: RegisterView },
  { path: 'Clientes', component: ClientsView },
  { path: 'Home', redirectTo: '', pathMatch: 'full' },
]

