import { Component, OnInit, ViewChild } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import { LocalStorageService } from '../local-storage.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable, Subject, from, of } from 'rxjs'
import { BookServiceService } from '../book-service.service'
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { Book } from '../book-service.service'
import { environment } from '../../environments/environment' 
export interface Tile {
  name: string,
  about: string,
  price: number,
  image: string
}
export interface Price {
  name: string,
  about: string,
  price: number,
  image: string
}
@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})

export class BooksComponent implements OnInit {
  pageSize = 10;
  allTiles : Tile[] = [];
  tiles : Tile[] = [];
  pageSizeOptions: number[] = [10];

  pageIndex:number = 0;
  lowValue:number = 0;
  highValue:number = 10; 
  cartLength : number = 0
  pageEvent: PageEvent;
  showContent : Observable<Tile>
  myCart : object[] = []
  books : Book[]
  constructor(private localStore : LocalStorageService, private router : Router, private service : BookServiceService) {
  this.bookInfo()
  this.tiles = this.allTiles;

  }
  ex : number[] = []

  bookInfo(){
    let response = fetch(`${environment.apiUrl}books`)
      .then( prom => prom.json())
        .then( users => {
          // users.map(item=> item.price = item.price + '$')
          users.map(item=> this.allTiles.push(item))
        })
    
  }
  private sendBook: Subject<Book> = new Subject<Book>();
  abservableBook = this.sendBook.asObservable();
  

  addToCart(cart){
    this.service.sendBookInfo(cart)
    this.ex.push(cart);
    localStorage.cart = JSON.stringify(this.ex)
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    alert(setPageSizeOptionsInput);
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  navigate(event) {
    this.service.openCurrentBook(event)
    this.router.navigate(['bookInfo', event.id])
  }
  ngOnInit() {
    
  }
  
  getPaginatorData(event){
    console.log(event);
    if(event.pageIndex === this.pageIndex + 1){
       this.lowValue = this.lowValue + this.pageSize;
       this.highValue =  this.highValue + this.pageSize;
      }
   else if(event.pageIndex === this.pageIndex - 1){
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue =  this.highValue - this.pageSize;
     }   
      this.pageIndex = event.pageIndex;
}

}

