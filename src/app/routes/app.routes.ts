import { Routes } from '@angular/router';
import { TableTestComponent } from '@components/table/test'
import { MyFeatureComponent } from '../components/modal/test';
import { NavBarTest } from '../components/navBar/test';
import { LoginView } from '@views/login/login.view';

export const routes: Routes = [

  { path: '', component: MyFeatureComponent} ,
  { path: 'nav-bar', component: NavBarTest },
  { path: 'login', component: LoginView },


]

