import { Component } from '@angular/core';
import { NavBar } from './navBar';

@Component({
  selector: 'nav-bar-test',
  template: `<nav-bar></nav-bar>`,
  imports: [NavBar]
})
export class NavBarTest {

}
