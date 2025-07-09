import { Routes } from '@angular/router';
import { MyFeatureComponent } from '../components/modal/test';
import { NavBarTest } from '../components/navBar/test';

export const routes: Routes = [
  { path: '', component: MyFeatureComponent} ,
  { path: 'nav-bar', component: NavBarTest },
  { path: 'login', component: MyFeatureComponent },

]
