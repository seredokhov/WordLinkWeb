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
import { UserDictionaryProgressService } from '../../../services/user-dictionary-progress.service';
import { UserDictionaryProgressData } from '../../../models';
import { createFilterPredicate, FilterOptions } from '../../../../utils';

@Component({
  selector: 'app-user-dictionary-progress-list',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './user-dictionary-progress-list.component.html',
  styleUrl: './user-dictionary-progress-list.component.scss'
})
export class UserDictionaryProgressListComponent implements OnInit, AfterViewInit, OnDestroy {
  public displayedColumns: string[] = [
    'userLogin',
    'userName',
    'dictionaryTheme',
    'dictionaryTitle',
    'totalWords',
    'bestProgressPercent',
    'bestCorrectAnswers',
    'lastCorrectCount'
  ];

  private userDictionaryProgressService = inject(UserDictionaryProgressService);
  private destroy$ = new Subject<void>();
  public dataSource: MatTableDataSource<UserDictionaryProgressData>;
  public isLoading: boolean = true;
  public paginationOptions: number[] = [5, 10, 20];
  public searchForm: FormGroup;
  public userNameFilterValue: string = '';
  public dictionaryTitleFilterValue: string = '';
  private filterOptions: FilterOptions = {
    fields: ['userLogin', 'userName', 'dictionaryTheme', 'dictionaryTitle'],
    separator: '&'
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.fetchProgress();
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
      userNameInput: new FormControl('', Validators.pattern('^[a-zA-Z ]+&')),
      dictionaryTitleInput: new FormControl('', Validators.pattern('^[a-zA-Z ]+&'))
    });
  }

  applyFilter() {
    this.userNameFilterValue = this.searchForm.get('userNameInput')?.value || '';
    this.dictionaryTitleFilterValue = this.searchForm.get('dictionaryTitleInput')?.value || '';

    const filterValue = this.userNameFilterValue + this.filterOptions.separator + this.dictionaryTitleFilterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchProgress() {
    this.userDictionaryProgressService
      .getUserDictionaryProgress()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items: UserDictionaryProgressData[]) => {
          this.dataSource.data = items.map((item) => ({
            ...item,
            dictionaryTheme: item.dictionaryTheme || item.dictionaryTitle
          }));
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching user dictionary progress:', error);
          this.isLoading = false;
        }
      });
  }

  refreshData() {
    this.isLoading = true;
    this.fetchProgress();
  }
}
