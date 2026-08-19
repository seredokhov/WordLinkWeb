import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import  {RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-aside-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIcon
  ],
  templateUrl: './aside-nav.component.html',
  styleUrl: './aside-nav.component.scss'
})
export class AsideNavComponent {
  routes = [
    {
      name: 'Users',
      path: '/main/users',
      icon: 'supervisor_account'
    },
    {
      name: 'Dictionaries',
      path: '/main/dictionaries',
      icon: 'library_books'
    },
    {
      name: 'Words',
      path: '/main/words',
      icon: 'book'
    }
  ];
}
