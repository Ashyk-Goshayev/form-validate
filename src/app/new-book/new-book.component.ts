import { Component, OnInit } from "@angular/core";
import { BookServiceService } from "../book-service.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Location } from "@angular/common";
import { Book } from "../interfaces";
import { HttpClient } from "@angular/common/http";
import { isArray } from "util";
@Component({
  selector: "app-new-book",
  templateUrl: "./new-book.component.html",
  styleUrls: ["./new-book.component.scss"]
})
export class NewBookComponent implements OnInit {
  private subsc: Subscription;
  book: Book;
  id: number;
  constructor(
    private service: BookServiceService,
    private activroute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.activroute.params.subscribe(params => {
      this.http.get(`${environment.apiUrl}books/${params.id}`).subscribe((item: Book[]) => {
        return (this.book = item[0]);
      });
    });
  }
  buy(item, obj) {
    if (localStorage.cart !== undefined) {
      if (!isArray(JSON.parse(localStorage.cart))) {
        let cart = [];
        cart.push(JSON.parse(localStorage.cart));
        cart.push(obj);
        localStorage.cart = JSON.stringify(cart);
      }
      let cart = JSON.parse(localStorage.cart);
      cart.push(obj);
      localStorage.cart = JSON.stringify(cart);
      return this.service.sendBookPrice(item);
    } else {
      localStorage.cart = JSON.stringify(obj);
      return this.service.sendBookPrice(item);
    }
  }
  goBack() {
    return this._location.back();
  }
}
