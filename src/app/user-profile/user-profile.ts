import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project';
import { AuthService } from '../auth';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    CommonModule
  ],
})
export class UserProfile implements OnInit {
  userId = '';
  user: any = {};
  projects: any[] = [];
  ownedProjects: any[] = [];
  memberProjects: any[] = [];
  loading = true;
  isCurrentUser = false;

  constructor(
    private route: ActivatedRoute, 
    private projectService: ProjectService, 
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    
    // Check if this is the current user's profile
    this.authService.getCurrentUserProfile().subscribe({
      next: (currentUser) => {
        this.isCurrentUser = currentUser.id.toString() === this.userId;
      },
      error: (error) => {
        console.error('Error checking current user:', error);
      }
    });

    // Load user profile and projects
    this.projectService.getUserProfile(this.userId).subscribe({
      next: (data) => {
        this.user = data.user || {};
        this.projects = data.projects || [];
        
        // Separate owned and member projects
        this.ownedProjects = this.projects.filter(p => p.user_role === 'owner');
        this.memberProjects = this.projects.filter(p => p.user_role === 'member');
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.loading = false;
      }
    });
  }

  goToProject(id: number) {
    this.router.navigate(['/project', id]);
  }

  editProfile() {
    // Navigate to edit profile page (to be implemented)
    this.router.navigate(['/profile/edit']);
  }

  formatExperience(experience: string): string {
    if (!experience) return 'Not specified';
    return experience;
  }

  formatDate(date: string): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  getProjectStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'on-hold': return 'status-on-hold';
      default: return 'status-default';
    }
  }
}
