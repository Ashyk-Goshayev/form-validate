import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Price, Admin, User, Book, Transaction } from "./interfaces";
import { Router } from "@angular/router";
import { __param } from "tslib";
import { environment } from "../environments/environment";
import { Subject } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { error } from "@angular/compiler/src/util";
import { map } from "rxjs/operators";
import { Options } from "selenium-webdriver/safari";
@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  arrayOfUsers: object[];
  admin: Admin = {
    email: "admin@gmail.com",
    password: "admin"
  };
  hideCart: boolean = true;
  books: Price[];
  users: User[];
  isCorrectSign: boolean = false; // for navigate to books page
  hide: boolean = true; // for hide buttons
  isAdminLogin: boolean = false;
  isSuccess: boolean = false;
  id: number;
  isEditButton: boolean = true;
  switchBooksPop: boolean = false;
  switchEditPop: boolean = false;

  constructor(private _toastr: ToastrService, private router: Router, private http: HttpClient) {
    this.arrayOfUsers = [];
    this.getData().subscribe((users: User[]) => (this.users = users));
    if (localStorage.currentUser !== undefined && localStorage.currentUser !== "") {
      if (JSON.parse(localStorage.currentUser)[0].email === "admin@gmail.com") {
        this.hide = false;
        this.hideCart = false;
        this.isAdminLogin = true;
      } else {
        this.isCorrectSign = true;
        this.hide = false;
        this.hideCart = true;
      }
    }
  }
  remove(item: Book) {
    return this.http.delete(`${environment.apiUrl}books/${item.id}`);
  }
  addBook(BooksForm: { name: string; about: string; price: number }, img: string) {
    if (!BooksForm.name || !BooksForm.price) {
      return this._toastr.error("Fill empty inputs", "WARNING");
    }
    return this.http
      .post(`${environment.apiUrl}books`, Object.assign(BooksForm, { image: img }))
      .subscribe(() => this._toastr.success("new book added", "Success"));
  }
  editBook() {
    if (!this.switchEditPop) {
      return (this.switchEditPop = true);
    }
    return (this.switchEditPop = false);
  }
  openBook() {
    if (!this.switchBooksPop) {
      return (this.switchBooksPop = true);
    }
    return (this.switchBooksPop = false);
  }
  getData() {
    return this.http.get(`${environment.apiUrl}users`);
  }
  async onsubmitReg(formInput: { email: string; password: string; passwordRepeat: string }, img: any) {
    var isSameUser = null;
    var testEmail = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    var testPass = /[a-zA-Z0-9]/g;
    isSameUser = this.users.filter(item => item.email === formInput.email);
    if (isSameUser.length >= 1) {
      this.isSuccess = false;
      this.hideCart = false;
      return this._toastr.error("User exist", "WARNING!");
    }
    if (testEmail.test(formInput.email) && testPass.test(formInput.password)) {
      if (formInput.password === formInput.passwordRepeat) {
        this.isSuccess = true;
        this.hideCart = true;
        this.http
          .post<User>(`${environment.apiUrl}users`, { email: formInput.email, password: formInput.password }, { observe: "response" })
          .subscribe(response => {
            if (!response) return this._toastr.error("Error 201");
            this.getData().subscribe((users: User[]) => (this.users = users));
            this._toastr.success("Registration passed", "SUCCESS");
          });
      } else {
        this._toastr.error("Passwords do not match", "WARNING!");
      }
    } else {
      this._toastr.error("email should be like example@gmail.com", "WARNING!");
    }
  }
  getToken() {
    return JSON.parse(localStorage.getItem("book")).name;
  }
  onsubmitSign(inputForm: { email: string; password: string }) {
    if (this.users != null || this.admin != null) {
      if ((this.users != null && this.admin.email !== inputForm.email) || this.admin.password !== inputForm.password) {
        let user;
        user = this.users.filter(elem => {
          return elem.email == inputForm.email ? elem.password == inputForm.password : null;
        });
        if (user.length >= 1) {
          localStorage.currentUser = JSON.stringify(user);
          this.hideCart = true;
          this.isCorrectSign = true;
          this.hide = false;
          this._toastr.success(`Welcome `, "SUCCESS");
        } else {
          this._toastr.error("email or password is wrong", "WARNING!");
        }
      } else if (this.admin.email === inputForm.email && this.admin.password === inputForm.password) {
        localStorage.currentUser = JSON.stringify([{ email: this.admin.email }]);
        this.hideCart = false;
        this.hide = false;
        this.isAdminLogin = true;
        this._toastr.success(`Welcome admin`, "SUCCESS");
      }
    } else {
      this._toastr.error("you dont have accaunt", "WARNING!");
    }
  }
}
