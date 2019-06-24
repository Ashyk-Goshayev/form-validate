import { Component, OnInit, ViewChild } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { LocalStorageService } from "../main.service";
import { MatPaginator } from "@angular/material/paginator";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../environments/environment";
import { BookServiceService } from "../book-service.service";
import { PeriodicElement, Transaction, User } from "../interfaces";

let ELEMENT_DATA: PeriodicElement[] = [];

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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
  pageSizeOptions: number[] = [10];
  IdForEdit: number;
  showBooks: string = "none";
  switchBooks: boolean = true;
  showUsers: string = "";
  row: User;
  file: File = null;
  image: string;
  uploaded: string;
  opacity: string;
  isSorted: boolean = true;

  enableBooks() {
    this.showBooks = "block";
    this.showUsers = "none";
  }
  enableUsers() {
    this.showBooks = "none";
    this.showUsers = "";
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
    if (!this.exampleForm.value.name || !this.exampleForm.value.price) {
      this.toastr.error("Fill empty inputs", "WARNING");
      return;
    }

    let response = await fetch(`${environment.apiUrl}books/${this.IdForEdit}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        Object.assign(this.exampleForm.value, { image: this.image })
      )
    });
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
      .map(t => t.price)
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
      }).then(() =>
        fetch(`${environment.apiUrl}books`)
          .then(item => item.json())
          .then(books => (this.transactions = books))
          .then(
            () =>
              (this.dataSource_2 = new MatTableDataSource<Transaction>(
                this.transactions
              ))
          )
      );

      this.uploaded = "flex";
      this.opacity = "0";
      this.openBook();
      this.toastr.success("new book added", "Success");
    } else {
      this.toastr.error("Fill empty inputs", "WARNING");
    }
  }

  getURL(img) {
    const reader = new FileReader();
    this.file = img.files[0] as File;
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
    reader.onload = () => {
      this.image = <string>reader.result;
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
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    }
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
    if (this.switchEdit && row) {
      this.editUser = "flex";
      this.switchEdit = false;
      this.passValue = row.password;
      this.loginValue = row.email;
      this.position = row.position;
      this.row = row;
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
      body: JSON.stringify(
        Object.assign({ email: em, password: pass }, { image: this.row.image })
      )
    }).then(() =>
      this.localStore.getData().then(users => (this.localStore.users = users))
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
    this.localStore.getData().then(users => {
      const isSameUser = users.filter(item => item.email === email);
      if (isSameUser.length === 0) {
        fetch(`${environment.apiUrl}users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: email, password: password })
        }).then(() => {
          this.localStore
            .getData()
            .then(users => (this.localStore.users = users));
          this.addUser({ email, password });
          this.togglePop();
        });
      } else {
        this.toastr.error("User exist", "WARNING");
      }
    });
  }
  constructor(
    private localStore: LocalStorageService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
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
