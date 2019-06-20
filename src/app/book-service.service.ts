import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { Subject }    from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
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
  constructor(private http: HttpClient) {
  
  }
  sendTextToFilter(text: string) {
    this.text.next(text)
  }
  myCart : object[] = []
  getBooks(books : Book[]){
    this.myCart.push(books)
    localStorage.setItem('cart', JSON.stringify(this.myCart))
  }
  minusPriceMethod(val : number) {
    this.minusPrice.next(val)
  }
  sendBookInfo(book: Book){
    this.sendBook.next(book)
  }
  openCurrentBook(book: Book) {
    this.openBook.next(book)
  }
  sendBookPrice(price: number) {
    this.price.next(price);
  }

}
export interface Book {
  image : string;
  name: string;
  price: number;
  about: string;
  id: number;
}