import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../project';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
  imports: [
    MatFormFieldModule, 
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    RouterModule, 
    CommonModule
  ],
})
export class ProjectDetails implements OnInit {
  project: any;
  loading = true;
  error: string | null = null;

  constructor(private projectService: ProjectService, public route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadProject(id!);
  }

  loadProject(id: string) {
    this.loading = true;
    this.error = null;
    
    this.projectService.getById(id).subscribe({
      next: (data) => {
        this.project = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.error = 'Failed to load project details';
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: string | number): string {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(amount));
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in progress': return 'status-in-progress';
      case 'planning': return 'status-planning';
      case 'on-hold': return 'status-on-hold';
      default: return 'status-default';
    }
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'picture_as_pdf';
      case 'doc':
      case 'docx': return 'description';
      case 'xls':
      case 'xlsx': return 'grid_on';
      case 'ppt':
      case 'pptx': return 'slideshow';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      case 'zip':
      case 'rar': return 'archive';
      default: return 'insert_drive_file';
    }
  }

  downloadFile(fileName: string) {
    window.open(`http://localhost:5000/uploads/${fileName}`, '_blank');
  }

  parseTeamMembers(teamMembers: any): any[] {
    if (!teamMembers) return [];
    if (Array.isArray(teamMembers)) return teamMembers;
    if (typeof teamMembers === 'string') {
      try {
        return JSON.parse(teamMembers);
      } catch {
        return [];
      }
    }
    return [];
  }

  parseModules(modules: any): string[] {
    if (!modules) return [];
    if (Array.isArray(modules)) return modules;
    if (typeof modules === 'string') {
      try {
        return JSON.parse(modules);
      } catch {
        return modules.split(',').map(m => m.trim());
      }
    }
    return [];
  }

  parseSearchKeywords(keywords: string): string[] {
    if (!keywords) return [];
    return keywords.split(',').map(k => k.trim()).filter(k => k);
  }
}
