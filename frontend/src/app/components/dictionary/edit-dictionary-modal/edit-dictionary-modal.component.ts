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
  selector: 'app-edit-dictionary-modal',
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
  templateUrl: './edit-dictionary-modal.component.html',
  styleUrl: './edit-dictionary-modal.component.scss'
})
export class EditDictionaryModalComponent {
  private dictionaryService = inject(DictionaryService);
  public data: DictionaryData = inject(MAT_DIALOG_DATA);
  public dictionaryForm: FormGroup;
  public error: string = '';

  constructor(private dialogRef: MatDialogRef<EditDictionaryModalComponent>) {
    this.dictionaryForm = new FormGroup<any>({
      title: new FormControl(this.data.title, [Validators.required, Validators.minLength(2)]),
      theme: new FormControl(this.data.theme || this.data.title || '', [Validators.required, Validators.minLength(2)])
    });
  }

  saveData() {
    if (!this.data) {
      return;
    }

    this.error = '';

    const dictionaryToUpdate = {
      id: this.data.id,
      ...this.dictionaryForm.value
    };

    this.dictionaryService
      .updateDictionary(dictionaryToUpdate)
      .pipe(first())
      .subscribe({
        next: (updatedDictionaryData: DictionaryData) => {
          this.data.title = updatedDictionaryData.title;
          this.data.theme = updatedDictionaryData.theme || updatedDictionaryData.title;
          this.dialogRef.close(updatedDictionaryData);
        },
        error: (error) => {
          console.error('Error updating dictionary:', error);
          this.error = error.error?.message || 'Failed to update dictionary. Please try again.';
        }
      });
  }
}
