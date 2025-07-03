import { Routes } from '@angular/router';
import { ProjectList } from './project-list/project-list';
import { Login } from './login/login';
import { Register } from './register/register';
import { AddProject } from './add-project/add-project';
import { Profile } from './profile/profile';
import { UserProfile } from './user-profile/user-profile';
import { ProjectDetails } from './project-detail/project-detail';

export const routes: Routes = [
  { path: '', component: ProjectList, pathMatch:'full'},
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'add', component: AddProject },
  { path: 'profile', component: Profile },
  {path:'user/:id', component:UserProfile},
  {path:'project/:id', component:ProjectDetails}
];