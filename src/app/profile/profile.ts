import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project';
import {FormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports :[FormsModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatInputModule, CommonModule],

})
export class Profile implements OnInit {
  projects:any[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.getMine().subscribe(res => this.projects = res);
  }
}
