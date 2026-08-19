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
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryWordService } from '../../../services/dictionary-word.service';
import { DictionaryData, DictionaryWordData } from '../../../models';
import { createFilterPredicate, FilterOptions } from '../../../../utils';
import { ConfirmationPopupComponent } from '../../confirmation-popup/confirmation-popup.component';
import { CreateDictionaryWordModalComponent } from '../create-dictionary-word-modal/create-dictionary-word-modal.component';
import { EditDictionaryWordModalComponent } from '../edit-dictionary-word-modal/edit-dictionary-word-modal.component';

interface DictionaryWordsResponse {
  dictionary: DictionaryData;
  words: DictionaryWordData[];
}

@Component({
  selector: 'app-dictionary-words-list',
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
  templateUrl: './dictionary-words-list.component.html',
  styleUrl: './dictionary-words-list.component.scss'
})
export class DictionaryWordsListComponent implements OnInit, AfterViewInit, OnDestroy {
  public displayedColumns: string[] = [
    'id',
    'word',
    'translate',
    'createdAt',
    'actions'
  ];

  private dictionaryWordService = inject(DictionaryWordService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  public dataSource: MatTableDataSource<DictionaryWordData>;
  public dictionary: DictionaryData | null = null;
  public dictionaryId: string = '';
  public isLoading: boolean = true;
  public paginationOptions: number[] = [5, 10, 20];
  public searchForm: FormGroup;
  public wordFilterValue: string = '';
  public translateFilterValue: string = '';
  private filterOptions: FilterOptions = {
    fields: ['word', 'translate'],
    separator: '&'
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public confirmPopup: MatDialog,
    public createWordPopup: MatDialog,
    public editWordPopup: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.dictionaryId = this.route.snapshot.paramMap.get('dictionaryId') || '';
    this.getWords();
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
      wordInput: new FormControl('', Validators.pattern('^[a-zA-Z ]+&')),
      translateInput: new FormControl('', Validators.pattern('^[a-zA-Z ]+&'))
    });
  }

  applyFilter() {
    this.wordFilterValue = this.searchForm.get('wordInput')?.value || '';
    this.translateFilterValue = this.searchForm.get('translateInput')?.value || '';

    const filterValue = this.wordFilterValue + this.filterOptions.separator + this.translateFilterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDeleteWordPopup(id: string) {
    const popupData = {
      data: {
        title: 'Delete Word',
        message: 'Are you sure you want to delete this word?',
        onConfirm: () => {
          this.dictionaryWordService.deleteDictionaryWord(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                const oldData = this.dataSource.data;
                this.dataSource.data = oldData.filter(word => word.id !== id);
              },
              error: (error) => {
                console.error('Error deleting dictionary word:', error);
              }
            });
        }
      },
      autoFocus: false
    };

    this.confirmPopup.open(ConfirmationPopupComponent, popupData);
  }

  openCreateWordPopup() {
    const popupData = {
      data: {
        dataSource: this.dataSource,
        dictionaryId: this.dictionaryId
      },
      autoFocus: false
    };

    this.createWordPopup.open(CreateDictionaryWordModalComponent, popupData);
  }

  openEditWordPopup(word: DictionaryWordData) {
    const popupData = {
      data: word,
      autoFocus: false
    };

    this.editWordPopup.open(EditDictionaryWordModalComponent, popupData);
  }

  getWords() {
    this.dictionaryWordService.getDictionaryWords(this.dictionaryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: DictionaryWordsResponse) => {
          this.dictionary = response.dictionary;
          this.dataSource.data = response.words;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching dictionary words:', error);
          this.isLoading = false;
        }
      })
  }

  refreshData() {
    this.isLoading = true;
    this.getWords();
  }

  backToDictionaries() {
    this.router.navigate(['/main/dictionaries']);
  }
}
