import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../project';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.html',
  imports: [MatFormFieldModule, MatCardModule, MatButtonModule, MatInputModule, RouterModule],

})
export class ProjectDetails implements OnInit {
  project: any;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.projectService.getById(id!).subscribe(data => this.project = data);
  }
}
