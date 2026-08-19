import { Component, inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryWordData } from '../../../models';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DictionaryWordService } from '../../../services/dictionary-word.service';

@Component({
  selector: 'app-create-dictionary-word-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-dictionary-word-modal.component.html',
  styleUrl: './create-dictionary-word-modal.component.scss'
})
export class CreateDictionaryWordModalComponent {
  private dictionaryWordService = inject(DictionaryWordService);
  public dialogData = inject(MAT_DIALOG_DATA);
  public wordForm: FormGroup;
  public error: string = '';

  constructor(private dialogRef: MatDialogRef<CreateDictionaryWordModalComponent>) {
    this.wordForm = new FormGroup<any>({
      word: new FormControl('', [Validators.required, Validators.minLength(1)]),
      translate: new FormControl('', [Validators.required, Validators.minLength(1)])
    });
  }

  saveData() {
    const { value } = this.wordForm;
    this.error = '';

    const wordToCreate = {
      word: value.word,
      translate: value.translate
    };

    this.dictionaryWordService.createDictionaryWord(this.dialogData.dictionaryId, wordToCreate)
      .pipe(first())
      .subscribe({
        next: (createdWord: DictionaryWordData) => {
          const oldWords = [...this.dialogData.dataSource.data];
          this.dialogData.dataSource.data = [createdWord, ...oldWords];
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error creating dictionary word:', error);
          this.error = error.error?.message || 'Failed to create word. Please try again.';
        }
      });
  }
}
