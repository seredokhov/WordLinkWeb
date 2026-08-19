import { Component, inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryData } from '../../../models';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DictionaryService } from '../../../services/dictionary.service';

@Component({
  selector: 'app-create-dictionary-modal',
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
  templateUrl: './create-dictionary-modal.component.html',
  styleUrl: './create-dictionary-modal.component.scss'
})
export class CreateDictionaryModalComponent {
  private dictionaryService = inject(DictionaryService);
  public dictionaries = inject(MAT_DIALOG_DATA);
  public dictionaryForm: FormGroup;
  public error: string = '';

  constructor(private dialogRef: MatDialogRef<CreateDictionaryModalComponent>) {
    this.dictionaryForm = new FormGroup<any>({
      title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
  }

  saveData() {
    const { value } = this.dictionaryForm;
    this.error = '';

    const dictionaryToCreate = {
      title: value.title
    };

    this.dictionaryService.createDictionary(dictionaryToCreate)
      .pipe(first())
      .subscribe({
        next: (createdDictionary: DictionaryData) => {
          const oldDictionaries = [...this.dictionaries.data];
          this.dictionaries.data = [createdDictionary, ...oldDictionaries];
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error creating dictionary:', error);
          this.error = error.error?.message || 'Failed to create dictionary. Please try again.';
        }
      });
  }
}
