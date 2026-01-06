import { Component, inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { WordService } from '../../../services/word.service';
import { WordData } from '../../../models';
import { createFilterPredicate, FilterOptions } from '../../../../utils';
import { ConfirmationPopupComponent } from '../../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-words-list',
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
  templateUrl: './words-list.component.html',
  styleUrl: './words-list.component.scss'
})
export class WordsListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'id',
    'word',
    'translate',
    'ownerLogin',
    'isFavorite',
    'isLearned',
    'lastUpdate',
    'actions'
  ];
  private wordService = inject(WordService);
  public dataSource: MatTableDataSource<WordData>;
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

  constructor(public confirmPopup: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.getWords();
    this.searchFormInit();
    this.dataSource.filterPredicate = createFilterPredicate(this.filterOptions);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
          this.wordService.deleteWord(id)
            .subscribe(() => {
              const oldData = this.dataSource.data;
              this.dataSource.data = oldData.filter(word => word.id !== id);
            });
        }
      },
      autoFocus: false
    };

    this.confirmPopup.open(ConfirmationPopupComponent, popupData);
  }

  getWords() {
    this.wordService.getWords()
      .subscribe((words: WordData[]) => {
        this.dataSource.data = words;
        this.isLoading = false;
      })
  }

  refreshData() {
    this.isLoading = true;
    this.getWords();
  }
}
