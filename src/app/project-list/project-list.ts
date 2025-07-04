import { Component, OnInit, Type } from '@angular/core';
import { ProjectService } from '../project';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    CommonModule
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss'
})
export class ProjectList implements OnInit {
  projects: any[] = [];
  search = '';
  loading = false;
  totalProjects = 0;

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.projectService.getAll(this.search).subscribe({
      next: (res) => {
        this.projects = res;
        this.totalProjects = res.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  viewProject(id: number) {
    this.router.navigate(['/project', id]);
  }

  viewUserProfile(userId: number, event: Event) {
    event.stopPropagation(); // Prevent triggering the project view
    this.router.navigate(['/user', userId]);
  }

  formatDate(date: string): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  getProjectStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in progress': 
      case 'in-progress': return 'status-in-progress';
      case 'planning': return 'status-planning';
      case 'on-hold': return 'status-on-hold';
      default: return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'check_circle';
      case 'in progress':
      case 'in-progress': return 'schedule';
      case 'planning': return 'build';
      case 'on-hold': return 'pause_circle';
      default: return 'help_outline';
    }
  }

  getTeamSize(teamMembers: any): number {
    if (!teamMembers) return 1; // Just the owner
    try {
      const members = typeof teamMembers === 'string' ? JSON.parse(teamMembers) : teamMembers;
      return Array.isArray(members) ? members.length + 1 : 1; // +1 for owner
    } catch {
      return 1;
    }
  }

  getKeywords(searchKeywords: string): string[] {
    if (!searchKeywords) return [];
    return searchKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0).slice(0, 3); // Show only first 3 keywords
  }

  getModules(modules: any): string[] {
    if (!modules) return [];
    try {
      const modulesList = Array.isArray(modules) ? modules : JSON.parse(modules);
      return Array.isArray(modulesList) ? modulesList.slice(0, 4) : []; // Show only first 4 modules
    } catch {
      return [];
    }
  }

  hasAttachments(attachments: any): boolean {
    if (!attachments) return false;
    try {
      const files = typeof attachments === 'string' ? JSON.parse(attachments) : attachments;
      return Array.isArray(files) && files.length > 0;
    } catch {
      return false;
    }
  }

  getAttachmentCount(attachments: any): number {
    if (!attachments) return 0;
    try {
      const files = typeof attachments === 'string' ? JSON.parse(attachments) : attachments;
      return Array.isArray(files) ? files.length : 0;
    } catch {
      return 0;
    }
  }

  onSearchChange() {
    // Debounce search for better performance
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.load();
    }, 300);
  }

  hasSecondaryStats(project: any): boolean {
    return !!(project.product_version || project.go_live_date || project.agile_project || project.business_unit || project.region);
  }

  hasTertiaryStats(project: any): boolean {
    return !!(project.project_financial_status || project.delivery_milestone || project.geography || project.entity);
  }

  hasSalesInfo(project: any): boolean {
    return !!(project.sales_person_1 || project.sales_person_2 || project.sales_person_3);
  }

  private searchTimeout: any;
}

