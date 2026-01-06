import { Component } from '@angular/core';
import { WordsListComponent } from '../../components/word/words-list/words-list.component';

@Component({
  selector: 'app-words-page',
  standalone: true,
  imports: [WordsListComponent],
  templateUrl: './words-page.component.html',
  styleUrl: './words-page.component.scss'
})
export class WordsPageComponent {

}
