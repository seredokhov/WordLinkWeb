import { Routes } from '@angular/router';
import { WordsPageComponent } from './pages/words-page/words-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',   redirectTo: '/main/users', pathMatch: 'full' },
  { path: 'main',   redirectTo: '/main/users', pathMatch: 'full' },
  { path: 'login', title: 'Login', component: LoginPageComponent },
  {
    path: 'main',
    title: 'Wordlink',
    canActivate: [authGuard],
    component: MainPageComponent,
    children: [
      { path: 'users', component: UsersPageComponent },
      { path: 'words', component: WordsPageComponent }
    ]
  },
];
