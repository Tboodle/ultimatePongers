import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ultimatePongers';

  constructor(private router: Router) { }

  isHomePage() {
    return this.router.url.endsWith('/');
  }

  isCompetitorsPage() {
    return this.router.url.endsWith('/competitors');
  }
}
