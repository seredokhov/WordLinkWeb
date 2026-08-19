import { Component, inject, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DictionaryService } from '../../../services/dictionary.service';
import { DictionaryData } from '../../../models';
import { createFilterPredicate, FilterOptions } from '../../../../utils';
import { ConfirmationPopupComponent } from '../../confirmation-popup/confirmation-popup.component';
import { CreateDictionaryModalComponent } from '../create-dictionary-modal/create-dictionary-modal.component';
import { EditDictionaryModalComponent } from '../edit-dictionary-modal/edit-dictionary-modal.component';

@Component({
  selector: 'app-dictionaries-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatIcon,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './dictionaries-list.component.html',
  styleUrl: './dictionaries-list.component.scss'
})
export class DictionariesListComponent implements OnInit, AfterViewInit, OnDestroy {
  public displayedColumns: string[] = [
    'id',
    'title',
    'wordsCount',
    'createdAt',
    'actions'
  ];

  private dictionaryService = inject(DictionaryService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  public dataSource: MatTableDataSource<DictionaryData>;
  public isLoading: boolean = true;
  public paginationOptions: number[] = [5, 10, 20];
  public searchForm: FormGroup;
  public titleFilterValue: string = '';
  private filterOptions: FilterOptions = {
    fields: ['title'],
    separator: '&'
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public confirmPopup: MatDialog,
    public createDictionaryPopup: MatDialog,
    public editDictionaryPopup: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.getDictionaries();
    this.searchFormInit();
    this.dataSource.filterPredicate = createFilterPredicate(this.filterOptions);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchFormInit() {
    this.searchForm = new FormGroup({
      titleInput: new FormControl('', Validators.pattern('^[a-zA-Z ]+&'))
    });
  }

  applyFilter() {
    this.titleFilterValue = this.searchForm.get('titleInput')?.value || '';
    this.dataSource.filter = this.titleFilterValue.trim().toLowerCase();
  }

  openDeleteDictionaryPopup(id: string) {
    const popupData = {
      data: {
        title: 'Delete Dictionary',
        message: 'Are you sure you want to delete this dictionary and all its words?',
        onConfirm: () => {
          this.dictionaryService.deleteDictionary(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                const oldData = this.dataSource.data;
                this.dataSource.data = oldData.filter(dictionary => dictionary.id !== id);
              },
              error: (error) => {
                console.error('Error deleting dictionary:', error);
              }
            });
        }
      },
      autoFocus: false
    };

    this.confirmPopup.open(ConfirmationPopupComponent, popupData);
  }

  openCreateDictionaryPopup() {
    const popupData = {
      data: this.dataSource,
      autoFocus: false
    };

    this.createDictionaryPopup.open(CreateDictionaryModalComponent, popupData);
  }

  openEditDictionaryPopup(dictionary: DictionaryData) {
    const popupData = {
      data: dictionary,
      autoFocus: false
    };

    this.editDictionaryPopup.open(EditDictionaryModalComponent, popupData);
  }

  openDictionaryWords(dictionary: DictionaryData) {
    if (!dictionary.id) {
      return;
    }

    this.router.navigate(['/main/dictionaries', dictionary.id, 'words']);
  }

  getDictionaries() {
    this.dictionaryService.getDictionaries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dictionaries: DictionaryData[]) => {
          this.dataSource.data = dictionaries;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching dictionaries:', error);
          this.isLoading = false;
        }
      })
  }

  refreshData() {
    this.isLoading = true;
    this.getDictionaries();
  }
}
