import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../main.service";
import { Router } from "@angular/router";
import { BookServiceService } from "../book-service.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
  user: string;
  img: string;
  hasImage: string;
  show: string = "none";
  constructor(
    private localStore: LocalStorageService,
    private route: Router,
    private BookService: BookServiceService,
    private _toastr: ToastrService
  ) {
    this.user = JSON.parse(localStorage.currentUser)[0].email.split(/@/g)[0];
    if (JSON.parse(localStorage.currentUser)[0].image) {
      this.hasImage = "none";
      this.img = JSON.parse(localStorage.currentUser)[0].image;
    } else {
      this.hasImage = "";
    }
  }
  showLog() {
    this.show = "block";
    setTimeout(() => (this.show = "none"), 3000);
  }
  openProfile() {
    return (this.show = "none");
  }
  logOut() {
    this.localStore.hide = true;
    this.localStore.isLogin = false;
    this.localStore.isCorrectSign = false;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("cart");
    this.localStore.hide;
    return this.route.navigate(["/"]);
  }
  ngOnInit() {
    this.BookService.observableUser.subscribe(x => {
      this.user = x.email.split(/@/g)[0];
      if (x.image) {
        this.hasImage = "none";
        this.img = x.image;
      } else {
        this.img = "";
        this.hasImage = "";
      }
    });

    // if (JSON.parse(localStorage.currentUser)[0].email !== "admin@gmail.com") {
    //   if (new Date() > new Date(JSON.parse(localStorage.expiresIn))) {
    //     this._toastr.error("Token Expired Update please");
    //     this.logOut();
    //   }
    // }
  }
}
