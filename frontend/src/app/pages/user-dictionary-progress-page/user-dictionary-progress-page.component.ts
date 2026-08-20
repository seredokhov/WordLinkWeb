import { Component } from '@angular/core';
import { UserDictionaryProgressListComponent } from '../../components/user-dictionary-progress/user-dictionary-progress-list/user-dictionary-progress-list.component';

@Component({
  selector: 'app-user-dictionary-progress-page',
  standalone: true,
  imports: [UserDictionaryProgressListComponent],
  templateUrl: './user-dictionary-progress-page.component.html',
  styleUrl: './user-dictionary-progress-page.component.scss'
})
export class UserDictionaryProgressPageComponent {

}
