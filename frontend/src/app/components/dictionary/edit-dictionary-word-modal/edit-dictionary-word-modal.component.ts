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
  selector: 'app-edit-dictionary-word-modal',
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
  templateUrl: './edit-dictionary-word-modal.component.html',
  styleUrl: './edit-dictionary-word-modal.component.scss'
})
export class EditDictionaryWordModalComponent {
  private dictionaryWordService = inject(DictionaryWordService);
  public data: DictionaryWordData = inject(MAT_DIALOG_DATA);
  public wordForm: FormGroup;
  public error: string = '';

  constructor(private dialogRef: MatDialogRef<EditDictionaryWordModalComponent>) {
    this.wordForm = new FormGroup<any>({
      word: new FormControl(this.data.word, [Validators.required, Validators.minLength(1)]),
      translate: new FormControl(this.data.translate, [Validators.required, Validators.minLength(1)])
    });
  }

  saveData() {
    if (!this.data) {
      return;
    }

    this.error = '';

    const wordToUpdate = {
      id: this.data.id,
      ...this.wordForm.value
    };

    this.dictionaryWordService
      .updateDictionaryWord(wordToUpdate)
      .pipe(first())
      .subscribe({
        next: (updatedWordData: DictionaryWordData) => {
          this.data.word = updatedWordData.word;
          this.data.translate = updatedWordData.translate;
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error updating dictionary word:', error);
          this.error = error.error?.message || 'Failed to update word. Please try again.';
        }
      });
  }
}
