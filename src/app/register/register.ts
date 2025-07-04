import { Component, NgModule  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { FormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports :[FormsModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatInputModule, CommonModule, MatSelectModule, MatExpansionModule]
})
export class Register {
  // Basic credentials
  username = '';
  email = '';
  password = '';
  
  // Personal details
  firstName = '';
  lastName = '';
  phone = '';
  dateOfBirth = '';
  
  // Professional details
  designation = '';
  department = '';
  experience = '';
  skills = '';
  
  // Contact & Address
  address = '';
  city = '';
  state = '';
  country = '';
  postalCode = '';
  
  // Additional info
  bio = '';
  linkedinProfile = '';
  githubProfile = '';
  
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      dateOfBirth: this.dateOfBirth,
      designation: this.designation,
      department: this.department,
      experience: this.experience,
      skills: this.skills,
      address: this.address,
      city: this.city,
      state: this.state,
      country: this.country,
      postalCode: this.postalCode,
      bio: this.bio,
      linkedinProfile: this.linkedinProfile,
      githubProfile: this.githubProfile
    };

    this.auth.register(userData).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.error = err.error?.error || 'Registration failed.'
    });
  }
}
