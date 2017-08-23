import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'qs-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {

  routes: Object[] = [{
      title: 'Overview',
      route: '/logs',
      icon: 'receipt',
    }, {
      title: 'Config Page',
      route: '/users',
      icon: 'people',
    }, {
      title: 'All Projects',
      route: '/projects',
      icon: 'receipt',
    },
  ];

  constructor(private _router: Router) {}

  logout(): void {
    this._router.navigate(['/login']);
  }
}
