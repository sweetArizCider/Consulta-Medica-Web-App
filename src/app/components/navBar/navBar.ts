import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 'nav-bar',
  templateUrl: './navBar.html',
  styleUrls: ['./navBar.css'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ]
})

export class NavBar {

}