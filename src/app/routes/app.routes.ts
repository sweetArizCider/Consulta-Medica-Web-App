import { Routes } from '@angular/router';
import { TableTestComponent } from '@components/table/test'
import { MyFeatureComponent } from '../components/modal/test';

export const routes: Routes = [
  {path: '', component: TableTestComponent},
  { path: '/test', component: MyFeatureComponent }
];

