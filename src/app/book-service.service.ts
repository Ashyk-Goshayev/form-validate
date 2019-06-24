import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User, Book } from "./interfaces";
@Injectable({
  providedIn: "root"
})
export class BookServiceService {
  private sendBook: Subject<Book> = new Subject<Book>();
  abservableBook = this.sendBook.asObservable();
  private openBook: Subject<Book> = new Subject<Book>();
  openObservableBook = this.openBook.asObservable();
  private price: Subject<number> = new Subject<number>();
  sendPrice = this.price.asObservable();
  private minusPrice: Subject<number> = new Subject<number>();
  sendMinusPrice = this.minusPrice.asObservable();
  private text: Subject<string> = new Subject<string>();
  sendText = this.text.asObservable();
  private currentUser: Subject<User> = new Subject<User>();
  observableUser = this.currentUser.asObservable();
  constructor(private http: HttpClient) {}
  sendCurrentUser(user: User) {
    this.currentUser.next(user);
  }
  sendTextToFilter(text: string) {
    this.text.next(text);
  }
  myCart: object[] = [];
  getBooks(books: Book[]) {
    this.myCart.push(books);
    localStorage.setItem("cart", JSON.stringify(this.myCart));
  }
  minusPriceMethod(val: number) {
    this.minusPrice.next(val);
  }
  sendBookInfo(book: Book) {
    this.sendBook.next(book);
  }
  openCurrentBook(book: Book) {
    this.openBook.next(book);
  }
  sendBookPrice(price: number) {
    this.price.next(price);
  }
}
