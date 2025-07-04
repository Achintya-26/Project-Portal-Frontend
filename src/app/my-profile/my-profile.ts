import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-my-profile',
  template: `<div>Loading your profile...</div>`,
  standalone: true
})
export class MyProfile implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get current user profile and redirect to user profile page
    this.authService.getCurrentUserProfile().subscribe({
      next: (user) => {
        if (user && user.id) {
          // Redirect to the user profile page with the current user's ID
          this.router.navigate(['/user', user.id]);
        } else {
          // If no user found, redirect to login
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        // Redirect to login if there's an error
        this.router.navigate(['/login']);
      }
    });
  }
}
