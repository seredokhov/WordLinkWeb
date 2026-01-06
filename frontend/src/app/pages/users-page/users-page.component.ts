import { Component } from '@angular/core';
import { UsersListComponent } from '../../components/user/users-list/users-list.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UsersListComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent {

}
