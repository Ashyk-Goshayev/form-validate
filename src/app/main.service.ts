import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Price, Admin, User } from "./interfaces";
import { Router } from "@angular/router";
import { __param } from "tslib";
import { environment } from "../environments/environment";

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
  constructor(private toastr: ToastrService, private router: Router) {
    this.arrayOfUsers = [];
    this.getData().then(users => (this.users = users));
    if (
      localStorage.currentUser !== undefined &&
      localStorage.currentUser !== ""
    ) {
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

  getData() {
    return fetch(`${environment.apiUrl}users`).then(prom => prom.json());
  }

  async onsubmitReg(
    formInput: { email: string; password: string; passwordRepeat: string },
    img: any
  ) {
    var isSameUser = null;
    var testEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var testPass = /[a-zA-Z0-9]/g;
    isSameUser = this.users.filter(item => item.email === formInput.email);
    if (isSameUser.length >= 1) {
      this.isSuccess = false;
      this.hideCart = false;
      return this.toastr.error("User exist", "WARNING!");
    }
    if (testEmail.test(formInput.email) && testPass.test(formInput.password)) {
      if (formInput.password === formInput.passwordRepeat) {
        this.isSuccess = true;
        this.hideCart = true;
        fetch(`${environment.apiUrl}users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: formInput.email,
            password: formInput.password,
            image: img
          })
        }).then(() =>
          this.getData().then(users => {
            this.users = users;
            this.toastr.success("Registration passed", "SUCCESS");
          })
        );
      } else {
        // this.isSuccess = false
        // this.hideCart = false
        this.toastr.error("Passwords do not match", "WARNING!");
      }
    } else {
      // this.isSuccess = false
      // this.hideCart = false
      this.toastr.error("email should be like example@gmail.com", "WARNING!");
    }
  }

  onsubmitSign(inputForm: { email: string; password: string }) {
    if (this.users != null || this.admin != null) {
      if (
        (this.users != null && this.admin.email !== inputForm.email) ||
        this.admin.password !== inputForm.password
      ) {
        let user;
        user = this.users.filter(elem => {
          return elem.email == inputForm.email
            ? elem.password == inputForm.password
            : null;
        });
        if (user.length >= 1) {
          localStorage.currentUser = JSON.stringify(user);
          this.hideCart = true;
          this.isCorrectSign = true;
          this.hide = false;
          this.toastr.success(`Welcome `, "SUCCESS");
        } else {
          // this.hideCart = false
          // this.isCorrectSign = false
          // this.hide = true
          this.toastr.error("email or password is wrong", "WARNING!");
        }
      } else if (
        this.admin.email === inputForm.email &&
        this.admin.password === inputForm.password
      ) {
        localStorage.currentUser = JSON.stringify([
          { email: this.admin.email }
        ]);
        this.hideCart = false;
        this.hide = false;
        this.isAdminLogin = true;
        this.toastr.success(`Welcome admin`, "SUCCESS");
      }
    } else {
      // this.hideCart = false
      // this.isCorrectSign = false
      // this.hide = true
      this.toastr.error("you dont have accaunt", "WARNING!");
    }
  }
}