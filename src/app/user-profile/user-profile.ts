import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  imports: [FormsModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatInputModule, CommonModule],

})
export class UserProfile implements OnInit {
  userId = '';
  projects: any[] = [];

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private router:Router) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.projectService.getByUserId(this.userId).subscribe(data => this.projects = data);
  }

  goToProject(id: number) {
    this.router.navigate(['/project', id]);
  }


}
