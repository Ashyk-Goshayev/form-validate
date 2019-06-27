import { Component, OnInit, ViewChild } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { LocalStorageService } from "../main.service";
import { MatPaginator } from "@angular/material/paginator";
import { environment } from "../../environments/environment";
import { BookServiceService } from "../book-service.service";
import { PeriodicElement, Transaction, User } from "../interfaces";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { isNgTemplate } from "@angular/compiler";

let ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})
export class AdminComponent implements OnInit {
  // isDisplayed: string = "none"; // for add User
  //isDisplayedPop: string = "none"; // for delete user
  switch: boolean = false;
  switchPop: boolean = false;
  id: number = 0;
  deleteUser: User;
  //editUser: string = "none"; // for edit user
  switchEdit: boolean = false;

  displayedColumns: string[] = ["select", "id", "image", "email", "password", "delete", "edit"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  passwordValue: string;
  loginValue: string;
  deleteAll: string;
  pageSizeOptions: number[] = [10];

  showUsers: string = "";
  row: User;

  isSorted: boolean = true;

  showSelected() {
    if (this.selection.selected.length > 0) {
      this.deleteAll = "block";
    } else {
      this.deleteAll = "none";
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }

    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.id + 1}`;
  }

  async deleteAllSelected() {
    for (const user of this.selection.selected) {
      this._http.delete(`${environment.apiUrl}users/${user.id}`).subscribe(() => {
        ELEMENT_DATA.splice(ELEMENT_DATA.indexOf(ELEMENT_DATA.filter(x => x.id === user.id)[0]), 1);
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      });
    }
  }
  openBook() {
    this._mainService.isEditButton = true;
    this._mainService.openBook();
  }
  sortByNo() {
    if (this.isSorted) {
      ELEMENT_DATA = ELEMENT_DATA.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } else if (a.id < b.id) {
          return 1;
        }
        return 0;
      });
      this.isSorted = false;
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    } else {
      ELEMENT_DATA = ELEMENT_DATA.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
      this.isSorted = true;
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    }
  }
  async deleteRow() {
    this._http.delete(`${environment.apiUrl}users/${this.deleteUser.id}`).subscribe(() => {
      let i = 0;
      for (const current of this.dataSource.data) {
        current.id === this.deleteUser.id ? ELEMENT_DATA.splice(i, 1) : null;
        i++;
      }
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
      this.openDialog();
    });
  }

  editValue(row = null) {
    if (!this.switchEdit) {
      this.switchEdit = true;
      this.passwordValue = row.password;
      this.loginValue = row.email;
      this.id = row.id;
      this.row = row;
    } else {
      this.switchEdit = false;
    }
  }

  togglePop() {
    if (!this.switchPop) {
      this.switchPop = true;
    } else {
      this.switchPop = false;
    }
  }
  confirm(em, pass) {
    console.log(this.id);

    this._http.put(`${environment.apiUrl}users/${this.id}`, Object.assign({ email: em, password: pass }, { image: this.row.image })).subscribe(() => {
      this._mainService.getData().subscribe((users: User[]) => (this._mainService.users = users));
    });
    this.editCurrentUser({ email: em, password: pass, id: this.id, image: this.row.image });
    this.editValue();
  }
  async openSnackBar(email: string, password: string) {
    this._mainService.getData().subscribe((users: User[]) => {
      const isSameUser = users.filter(item => item.email === email);
      if (isSameUser.length === 0) {
        this._http.post(`${environment.apiUrl}users`, { email: email, password: password }).subscribe(() => {
          this._mainService.getData().subscribe((users: User[]) => (this._mainService.users = users));
          this.addUser({ email, password });
          this.togglePop();
        });
      } else {
        this._toastr.error("User exist", "WARNING");
      }
    });
  }
  constructor(
    private _mainService: LocalStorageService,
    private _toastr: ToastrService,
    private _bookService: BookServiceService,
    private _router: Router,
    private _http: HttpClient
  ) {}
  enableContent: boolean = false;
  enableBooks() {
    return (this.enableContent = true);
  }
  enableUsers() {
    return (this.enableContent = false);
  }
  openDialog(row = null) {
    if (!this.switch && row) {
      this.deleteUser = row;
      this.switch = true;
    } else {
      this.switch = false;
    }
  }

  addUser(user) {
    let k = 0;
    for (const i of ELEMENT_DATA) {
      if (i.id > k) {
        k = i.id;
      }
    }
    ELEMENT_DATA.push({
      image: user.image,
      email: user.email,
      password: user.password,
      id: k + 1
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }
  editCurrentUser(user) {
    const oldUser = ELEMENT_DATA.filter(x => {
      return x.id === user.id;
    })[0];
    if (oldUser) {
      oldUser.email = user.email;
    }

    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    ELEMENT_DATA.length = 0;
    this._http.get(`${environment.apiUrl}users`).subscribe((users: User[]) => {
      users.map(user => {
        ELEMENT_DATA.push(user);
      });
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    });
    this._bookService.sendText.subscribe(x => {
      this.dataSource = new MatTableDataSource<PeriodicElement>(
        ELEMENT_DATA.filter(item => {
          return item.email.toLowerCase().indexOf(x) > -1;
        })
      );
    });
  }
}
