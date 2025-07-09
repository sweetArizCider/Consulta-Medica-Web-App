import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { LoaderComponent } from './components/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  template: `
    <router-outlet/>
    <app-loader></app-loader>`,
})
export class App {}
