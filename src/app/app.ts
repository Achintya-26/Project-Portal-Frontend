import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected title = 'Project Portal';

  constructor(public auth: AuthService, private router: Router){}

  get isLoggedIn() {
    return this.auth.isLoggedIn;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
