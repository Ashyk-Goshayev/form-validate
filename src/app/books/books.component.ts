import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { LocalStorageService } from "../main.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { BookServiceService } from "../book-service.service";
import { Book, Tile } from "../interfaces";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

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
  arrayOfBooks: number[] = [];
  pageIndex: number = 0;
  lowValue: number = 0;
  highValue: number = 10;
  cartLength: number = 0;
  pageEvent: PageEvent;
  showContent: Observable<Tile>;
  myCart: Book[] = [];
  books: Book[];
  constructor(private localStore: LocalStorageService, private router: Router, private service: BookServiceService, private _http: HttpClient) {
    this.bookInfo();
    this.tiles = this.allTiles;
  }

  bookInfo() {
    this._http.get(`${environment.apiUrl}books`).subscribe((books: Book[]) => {
      books.map(item => this.allTiles.push(item));
    });
  }

  addToCart(cart) {
    this.service.sendBookInfo(cart);
    if (localStorage.cart !== undefined) {
      this.arrayOfBooks = JSON.parse(localStorage.cart);
      this.arrayOfBooks.unshift(cart);
      return (localStorage.cart = JSON.stringify(this.arrayOfBooks));
    }
    this.arrayOfBooks.unshift(cart);
    return (localStorage.cart = JSON.stringify(this.arrayOfBooks));
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(",").map(str => +str);
  }
  navigateToCurrentBook(event) {
    this.service.openCurrentBook(event);
    this.router.navigate(["bookInfo", event.id]);
  }
  ngOnInit() {
    this.service.sendText.subscribe(x => {
      this._http.get(`${environment.apiUrl}books`).subscribe((element: Book[]) => {
        this.tiles = element.filter(item => {
          return item.name.toLowerCase().indexOf(x) > -1 || item.price == +x;
        });
      });
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
