import { Component } from '@angular/core';
import { DictionariesListComponent } from '../../components/dictionary/dictionaries-list/dictionaries-list.component';

@Component({
  selector: 'app-dictionaries-page',
  standalone: true,
  imports: [DictionariesListComponent],
  templateUrl: './dictionaries-page.component.html',
  styleUrl: './dictionaries-page.component.scss'
})
export class DictionariesPageComponent {

}
