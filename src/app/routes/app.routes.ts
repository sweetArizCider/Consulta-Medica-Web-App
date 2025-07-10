import { Routes } from '@angular/router';
import { TableTestComponent } from '@components/table/test'
import { MyFeatureComponent } from '../components/modal/test';
import { NavBarTest } from '../components/navBar/test';
import { LoginView } from '@views/login/login.view';
import { RegisterViewComponent } from '@views/register/register.view';
import { LandingComponent } from '../views/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'nav-bar', component: NavBarTest },
  { path: 'login', component: LoginView },
  { path: 'register', component: RegisterViewComponent },
]

