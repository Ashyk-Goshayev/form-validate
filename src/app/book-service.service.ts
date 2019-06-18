import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { Subject }    from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class BookServiceService {
  private addBook = new Subject<Book>();

  missionAnnounced = this.addBook.asObservable();
  announceMission(book: Book){
    this.addBook.next(book);
  }
  constructor() {}
}
export interface Book {
  image : string;
  name: string;
}