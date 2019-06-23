import { Component, OnInit } from "@angular/core";
import { SelectionModel, DataSource } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { LocalStorageService } from "../local-storage.service";
import { Router, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { BookServiceService } from "../book-service.service";
import { PageEvent } from "@angular/material/paginator";
import { element } from "protractor";
export interface PeriodicElement {
  email: string;
  position: number;
  password: string;
  delete: string;
  edit: string;
  image: string;
}
export interface Transaction {
  id: number;
  image: string;
  name: string;
}
export interface Tile {
  name: string;
  about: string;
  price: number;
  image: string;
}

let ELEMENT_DATA: PeriodicElement[] = [];
export interface User {
  id: number;
  email: string;
  password: string;
}
export interface User {
  email: string;
  password: string;
}

export interface Books {
  name: string;
  about: string;
  price: number;
  image: string;
}
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})
export class AdminComponent implements OnInit {
  isDisplayed: string = "none"; // for add User
  isDisplayedPop: string = "none"; // for delete user
  switch: boolean = true;
  switchPop: boolean = true;
  position: number = 0;
  deleteUser: object;
  editUser: string = "none"; // for edit user
  switchEdit: boolean = true;
  newBook: string = "none"; // for adding new book
  switchBookPop: boolean = true;
  displayedColumns: string[] = [
    "select",
    "position",
    "image",
    "email",
    "password",
    "delete",
    "edit"
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource_2 = new MatTableDataSource<Transaction>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  passValue: string;
  loginValue: string;
  exampleForm: FormGroup;
  deleteAll: string;
  photoOfBook: any;
  bookName: string;
  bookAbout: string;
  bookPrice: number;
  bool: boolean;
  pageSize = 3;
  allTiles: Tile[] = [];
  tiles: Tile[] = [];
  pageSizeOptions: number[] = [3];
  pageIndex: number = 0;
  lowValue: number = 0;
  highValue: number = 3;
  pageEvent: PageEvent;
  IdForEdit: number;
  showBooks: string = "none";
  switchBooks: boolean = true;
  showUsers: string = "";
  enableBooks() {
    this.showBooks = "block";
    this.showUsers = "none";
  }
  enableUsers() {
    this.showBooks = "none";
    this.showUsers = "";
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(",").map(str => +str);
  }
  async remove(item, i) {
    let response = await fetch(`${environment.apiUrl}books/${item.id}`, {
      method: "DELETE"
    });
    if (response.ok) {
      fetch(`${environment.apiUrl}books`)
        .then(item => item.json())
        .then(elem => (this.transactions = elem))
        .then(
          () =>
            (this.dataSource_2 = new MatTableDataSource<Transaction>(
              this.transactions
            ))
        );
    }
  }
  switchBook() {
    if (this.switchBookPop) {
      this.newBook = "flex";
      this.switchBookPop = false;
    } else {
      this.newBook = "none";
      this.switchBookPop = true;
    }
  }
  editBook(item) {
    this.bookName = item.name;
    this.exampleForm.value.name = item.name;
    this.bookAbout = item.about;
    this.exampleForm.value.about = item.about;
    this.bookPrice = item.price;
    this.exampleForm.value.price = item.price;
    this.photoOfBook = item.image;
    this.exampleForm.value.image = item.image;
    this.image = item.image;
    this.IdForEdit = item.id;
    this.bool = false;
    this.switchBook();
  }
  async editCurrentBook() {
    if (
      this.exampleForm.value.name !== null &&
      this.exampleForm.value.price !== null
    ) {
      let response = await fetch(
        `${environment.apiUrl}books/${this.IdForEdit}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            Object.assign(this.exampleForm.value, { image: this.image })
          )
        }
      );
      if (response.ok) {
        let res = await fetch(`${environment.apiUrl}books`)
          .then(item => item.json())
          .then(element => (this.transactions = element))
          .then(
            () =>
              (this.dataSource_2 = new MatTableDataSource<Transaction>(
                this.transactions
              ))
          );
        this.uploaded = "flex";
        this.opacity = "0";
        this.switchBook();
        this.toastr.success("book edited", "Success");
      }
    } else {
      this.toastr.error("Fill empty inputs", "WARNING");
    }
  }

  getPaginatorData(event) {
    console.log(event);
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }
  showSelected() {
    if (this.selection.selected.length > 0) {
      this.deleteAll = "block";
    } else {
      this.deleteAll = "none";
    }
  }
  displayedColumnss = ["id", "image", "name", "price", "buttons"];
  transactions: Transaction[] = [];
  getTotalCost() {
    return this.transactions
      .map(t => t.id)
      .reduce((acc, value) => acc + value, 0);
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
  file: File = null;
  image: any;
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }

    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }
  addBook() {
    if (
      this.exampleForm.value.name !== null &&
      this.exampleForm.value.price !== null
    ) {
      fetch(`${environment.apiUrl}books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          Object.assign(this.exampleForm.value, { image: this.image })
        )
      });
      this.uploaded = "flex";
      this.opacity = "0";
      this.openBook();
      this.toastr.success("new book added", "Success");
    } else {
      this.toastr.error("Fill empty inputs", "WARNING");
    }
  }

  uploaded: string;
  opacity: string;
  getURL(img) {
    const reader = new FileReader();
    this.file = img.files[0] as File;
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
    reader.onload = () => {
      this.image = reader.result;
      this.photoOfBook = reader.result;
      this.uploaded = "none";
      this.opacity = "1";
      this.toastr.success("Loaded");
    };
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
      this.dataSource.data = ELEMENT_DATA;
    }
  }
  isSorted: boolean = true;

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
      return (this.dataSource = new MatTableDataSource<PeriodicElement>(
        ELEMENT_DATA
      ));
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
      return (this.dataSource = new MatTableDataSource<PeriodicElement>(
        ELEMENT_DATA
      ));
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
      this.openDialog();
    } else {
      alert("not deleted");
    }
  }
  editValue(row) {
    if (this.switchEdit) {
      this.editUser = "flex";
      this.switchEdit = false;
      this.passValue = row.password;
      this.loginValue = row.email;
      this.position = row.position;
    } else {
      this.editUser = "none";
      this.switchEdit = true;
    }
  }

  openBook() {
    this.bookName = null;
    this.bookAbout = null;
    this.bookPrice = null;
    this.bool = true;
    this.switchBook();
  }
  togglePop() {
    if (this.switch) {
      this.isDisplayed = "flex";
      this.switch = false;
    } else {
      this.isDisplayed = "none";
      this.switch = true;
    }
  }
  confirm(em, pass) {
    fetch(`${environment.apiUrl}users/${this.position}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: em, password: pass })
    });
    this.editCurrentUser({ email: em, password: pass, id: this.position });
  }
  async openSnackBar(email: string, password: string) {
    this.localStore.getData();
    const isSameUser = this.localStore.users.filter(
      item => item.email === email
    );
    if (isSameUser.length === 0) {
      const result = await fetch(`${environment.apiUrl}users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      if (result.ok) {
        this.addUser({ email, password });
        this.togglePop();
      }
    } else {
      this.toastr.error("User exist", "WARNING");
    }
  }
  constructor(
    private localStore: LocalStorageService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private location: Location,
    private bookService: BookServiceService
  ) {
    this.createForm();
  }

  openDialog(row = null) {
    this.deleteUser = row;

    if (this.switchPop) {
      this.isDisplayedPop = "flex";
      this.switchPop = false;
    } else {
      this.isDisplayedPop = "none";
      this.switchPop = true;
    }
  }
  createForm() {
    this.exampleForm = this.formBuilder.group({
      name: new FormControl(),
      about: new FormControl(),
      price: new FormControl()
    });
  }

  addUser(user) {
    ELEMENT_DATA.push({
      image: user.image,
      email: user.email,
      delete: "delete",
      edit: "edit",
      password: user.password,
      position: ELEMENT_DATA.length + 1
    });
    this.dataSource.data = ELEMENT_DATA;
  }
  editCurrentUser(user) {
    const oldUser = ELEMENT_DATA.filter(x => {
      return x.position === user.id;
    })[0];
    if (oldUser) {
      oldUser.email = user.email;
    }

    this.dataSource.data = ELEMENT_DATA;
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
            delete: "delete",
            edit: "edit",
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
      );
    this.bookService.sendText.subscribe(x => {
      this.dataSource = new MatTableDataSource<PeriodicElement>(
        ELEMENT_DATA.filter(item => {
          return item.email.toLowerCase().indexOf(x) > -1;
        })
      );
    });
    fetch(`${environment.apiUrl}books`)
      .then(prom => prom.json())
      .then(item => {
        this.transactions = item;
      })
      .then(
        () =>
          (this.dataSource_2 = new MatTableDataSource<Transaction>(
            this.transactions
          ))
      );
  }
}
