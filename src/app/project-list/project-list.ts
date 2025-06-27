import { Component, OnInit, Type } from '@angular/core';
import { ProjectService } from '../project';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list',
  imports :[FormsModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatInputModule, MatCardActions, CommonModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss'
})
export class ProjectList implements OnInit {
  projects:any[] = [];
  search = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.projectService.getAll(this.search).subscribe(res => {
      this.projects = res
    }
    );
  }
}

