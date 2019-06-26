import { Component, OnInit } from "@angular/core";
import { BookServiceService } from "../book-service.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Location } from "@angular/common";
import { Book } from "../interfaces";
import { HttpClient } from "@angular/common/http";
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
    this.subsc = this.activroute.params.subscribe(params => {
      this.id = params["id"];
      this.http.get(`${environment.apiUrl}books/${this.id}`).subscribe((item: Book) => {
        return (this.book = item);
      });
    });
  }
  buy(item, obj) {
    let cart = JSON.parse(localStorage.cart);
    cart.push(obj);
    localStorage.cart = JSON.stringify(cart);
    this.service.sendBookPrice(item);
  }
  goBack() {
    return this._location.back();
  }
}
