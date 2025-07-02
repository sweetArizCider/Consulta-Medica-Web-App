import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { Loader } from './components/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
  template: `
    <router-outlet/>
    <app-loader></app-loader>`,
})
export class App {}
