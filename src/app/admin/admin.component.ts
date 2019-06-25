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
  position: number = 0;
  deleteUser: object;
  //editUser: string = "none"; // for edit user
  switchEdit: boolean = false;

  displayedColumns: string[] = [
    "select",
    "position",
    "image",
    "email",
    "password",
    "delete",
    "edit"
  ];
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
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }

    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }

  async deleteAllSelected() {
    const users = this.selection.selected;
    let response = null;
    for (const u of users) {
      response = await fetch(`${environment.apiUrl}users/${u.position}`, {
        method: "DELETE"
      });
    }
    if (response.ok) {
      for (const u of users) {
        const el = ELEMENT_DATA.filter(x => {
          return x.position === u.position;
        })[0];
        ELEMENT_DATA.splice(ELEMENT_DATA.indexOf(el), 1);
      }
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    }
  }
  openBook() {
    this._mainService.isEditButton = true;
    this._mainService.openBook();
  }
  sortByNo() {
    if (this.isSorted) {
      ELEMENT_DATA = ELEMENT_DATA.sort((a, b) => {
        if (a.position > b.position) {
          return -1;
        } else if (a.position < b.position) {
          return 1;
        }
        return 0;
      });
      this.isSorted = false;
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    } else {
      ELEMENT_DATA = ELEMENT_DATA.sort((a, b) => {
        if (a.position < b.position) {
          return -1;
        } else if (a.position > b.position) {
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
    let user;
    user = this.deleteUser;
    const response = await fetch(
      `${environment.apiUrl}users/${user.position}`,
      {
        method: "DELETE"
      }
    );

    if (response.ok) {
      let i = 0;
      for (const current of this.dataSource.data) {
        current.position === user.position ? ELEMENT_DATA.splice(i, 1) : null;
        i++;
      }
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
      this.openDialog();
    } else {
      alert("not deleted");
    }
  }

  editValue(row = null) {
    if (!this.switchEdit) {
      this.switchEdit = true;
      this.passwordValue = row.password;
      this.loginValue = row.email;
      this.position = row.position;
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
    fetch(`${environment.apiUrl}users/${this.position}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        Object.assign({ email: em, password: pass }, { image: this.row.image })
      )
    }).then(() =>
      this._mainService
        .getData()
        .then(users => (this._mainService.users = users))
    );
    this.editCurrentUser({
      email: em,
      password: pass,
      id: this.position,
      image: this.row.image
    });
    this.editValue();
  }
  async openSnackBar(email: string, password: string) {
    this._mainService.getData().then(users => {
      const isSameUser = users.filter(item => item.email === email);
      if (isSameUser.length === 0) {
        fetch(`${environment.apiUrl}users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: email, password: password })
        }).then(() => {
          this._mainService
            .getData()
            .then(users => (this._mainService.users = users));
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
    private _router: Router
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
    ELEMENT_DATA.push({
      image: user.image,
      email: user.email,
      // delete: "delete",
      // edit: "edit",
      password: user.password,
      position: ELEMENT_DATA.length + 1
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }
  editCurrentUser(user) {
    const oldUser = ELEMENT_DATA.filter(x => {
      return x.position === user.id;
    })[0];
    if (oldUser) {
      oldUser.email = user.email;
    }

    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    ELEMENT_DATA.length = 0;
    fetch(`${environment.apiUrl}users`)
      .then(prom => prom.json())
      .then(users => {
        users.map(item =>
          ELEMENT_DATA.push({
            image: item.image,
            email: item.email,
            password: item.password,
            position: item.id
          })
        );
      })
      .then(
        () =>
          (this.dataSource = new MatTableDataSource<PeriodicElement>(
            ELEMENT_DATA
          ))
      )
      .then(() => (this.dataSource.paginator = this.paginator));
    this._bookService.sendText.subscribe(x => {
      this.dataSource = new MatTableDataSource<PeriodicElement>(
        ELEMENT_DATA.filter(item => {
          return item.email.toLowerCase().indexOf(x) > -1;
        })
      );
    });
  }
}
