import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { LocalStorageService } from "../main.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { BookServiceService } from "../book-service.service";
import { Book } from "../interfaces";
import { environment } from "../../environments/environment";
import { Tile } from "../interfaces";

@Component({
  selector: "app-books",
  templateUrl: "./books.component.html",
  styleUrls: ["./books.component.scss"]
})
export class BooksComponent implements OnInit {
  pageSize = 10;
  allTiles: Tile[] = [];
  tiles: Tile[] = [];
  pageSizeOptions: number[] = [10];
  ex: number[] = [];
  pageIndex: number = 0;
  lowValue: number = 0;
  highValue: number = 10;
  cartLength: number = 0;
  pageEvent: PageEvent;
  showContent: Observable<Tile>;
  myCart: any[] = [];
  books: Book[];
  constructor(
    private localStore: LocalStorageService,
    private router: Router,
    private service: BookServiceService
  ) {
    this.bookInfo();
    this.tiles = this.allTiles;
  }

  bookInfo() {
    let response = fetch(`${environment.apiUrl}books`)
      .then(prom => prom.json())
      .then(users => {
        // users.map(item=> item.price = item.price + '$')
        users.map(item => this.allTiles.push(item));
      });
  }

  addToCart(cart) {
    this.service.sendBookInfo(cart);
    if (localStorage.cart !== undefined) {
      this.ex = JSON.parse(localStorage.cart);
      this.ex.unshift(cart);
      return (localStorage.cart = JSON.stringify(this.ex));
    }
    this.ex.unshift(cart);
    return (localStorage.cart = JSON.stringify(this.ex));
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    alert(setPageSizeOptionsInput);
    this.pageSizeOptions = setPageSizeOptionsInput.split(",").map(str => +str);
  }
  navigate(event) {
    this.service.openCurrentBook(event);
    this.router.navigate(["bookInfo", event.id]);
  }
  ngOnInit() {
    this.service.sendText.subscribe(x => {
      fetch(`${environment.apiUrl}books`)
        .then(item => item.json())
        .then(
          element =>
            (this.tiles = element.filter(item => {
              return (
                item.name.toLowerCase().indexOf(x) > -1 || item.price == +x
              );
            }))
        );
    });
  }

  getPaginatorData(event) {
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }
}
