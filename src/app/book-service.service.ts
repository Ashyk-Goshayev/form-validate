import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { Subject }    from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class BookServiceService {
  private sendBook: Subject<Book> = new Subject<Book>();
  abservableBook = this.sendBook.asObservable();
  private openBook: Subject<Book> = new Subject<Book>();
  openObservableBook = this.openBook.asObservable();
  constructor(private http: HttpClient) {

  }
  myCart : object[] = []
  getBooks(books : Book[]){
    this.myCart.push(books)
    localStorage.setItem('cart', JSON.stringify(this.myCart))
  }

  sendBookInfo(book: Book){
    this.sendBook.next(book)
  }
  openCurrentBook(book: Book) {
    this.openBook.next(book)
  }
}
export interface Book {
  image : string;
  name: string;
  price: number;
  about: string;
  id: number;
}