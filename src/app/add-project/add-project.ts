import { Component } from '@angular/core';
import { ProjectService } from '../project';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-project',
  imports :[FormsModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatInputModule, MatCardActions],
  templateUrl: './add-project.html',
  styleUrl: './add-project.scss'
})
export class AddProject {
  topic = '';
  description = '';
  repo_link = '';
  team = '';
  attachments: File[] = [];

  constructor(private projectService: ProjectService) {}

  onFileChange(e: any) {
    this.attachments = Array.from(e.target.files);
  }

  submit() {
    const form = new FormData();
    form.append('topic', this.topic);
    form.append('description', this.description);
    form.append('repo_link', this.repo_link);
    form.append('team_members', JSON.stringify(this.team.split(',').map(t => t.trim())));
    this.attachments.forEach((f) => form.append('attachments', f));

    this.projectService.add(form).subscribe(() => {
      alert('Created!');
    });
  }
}

