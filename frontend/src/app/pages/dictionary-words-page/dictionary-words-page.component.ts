import { Component } from '@angular/core';
import { DictionaryWordsListComponent } from '../../components/dictionary/dictionary-words-list/dictionary-words-list.component';

@Component({
  selector: 'app-dictionary-words-page',
  standalone: true,
  imports: [DictionaryWordsListComponent],
  templateUrl: './dictionary-words-page.component.html',
  styleUrl: './dictionary-words-page.component.scss'
})
export class DictionaryWordsPageComponent {

}
