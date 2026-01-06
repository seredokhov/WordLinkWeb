import { Component, inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../models';
import { CreateUserModalComponent } from '../create-user-modal/create-user-modal.component';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { createFilterPredicate, FilterOptions } from '../../../../utils';
import {ConfirmationPopupComponent} from '../../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-users-list',
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
    MatMenuModule,
    MatDialogModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements AfterViewInit, OnInit  {
  public displayedColumns: string[] = [
    'id',
    'login',
    'name',
    'wordsCount',
    'lastTestDate',
    'createdAt',
    'actions'
  ];

  public dataSource: MatTableDataSource<UserData>;
  public isLoading: boolean = true;
  public paginationOptions: number[] = [5, 10, 20];
  public searchForm: FormGroup;
  public loginFilterValue: string = '';
  public nameFilterValue: string = '';
  public date: Date = new Date();
  private userService = inject(UserService);
  private filterOptions: FilterOptions = {
    fields: ['login', 'name'],
    separator: '&'
  };

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    public createUserPopup: MatDialog,
    public editUserPopup: MatDialog,
    public confirmPopup: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.fetchUsers();
    this.searchFormInit();
    this.dataSource.filterPredicate = createFilterPredicate(this.filterOptions);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchFormInit() {
    this.searchForm = new FormGroup({
      loginInput: new FormControl('', Validators.pattern('^[a-zA-Z ]+&')),
      nameInput: new FormControl('', Validators.pattern('^[a-zA-Z ]+&'))
    });
  }

  applyFilter() {
    this.loginFilterValue = this.searchForm.get('loginInput')?.value || '';
    this.nameFilterValue = this.searchForm.get('nameInput')?.value || '';

    const filterValue = this.loginFilterValue + this.filterOptions.separator + this.nameFilterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchUsers() {
    this.userService
      .getUsers()
      .subscribe((users: UserData[]) => {
        this.dataSource.data = users;
        this.isLoading = false;
      });
  }

  refreshData() {
    this.isLoading = true;
    this.fetchUsers();
  }

  openEditUserPopup(user: UserData) {
    const popupData = {
      data: user,
      autoFocus: false
    };

    this.createUserPopup.open(EditUserModalComponent, popupData);
  }

  openDeleteUserPopup(id: string) {
    const popupData = {
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?',
        onConfirm: () => {
          this.userService.deleteUser(id)
            .subscribe(() => {
              const oldUsersData = this.dataSource.data;
              this.dataSource.data = oldUsersData.filter(user => user.id !== id);
            });
        }
      },
      autoFocus: false
    };

    this.confirmPopup.open(ConfirmationPopupComponent, popupData);


  }

  openCreateUserPopup() {
    const popupData = {
      data: this.dataSource,
      autoFocus: false
    };

    this.createUserPopup.open(CreateUserModalComponent, popupData);
  }
}

