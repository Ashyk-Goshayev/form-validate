import { Component, OnInit, ViewChild } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import { LocalStorageService } from '../local-storage.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { BookServiceService } from '../book-service.service'
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

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
  cartLength : number;
  pageEvent: PageEvent;
  showContent : Observable<Tile>

  constructor(private localStore : LocalStorageService, private router : Router, private service : BookServiceService) {
  this.bookInfo()
  this.tiles = this.allTiles;
  this.localStore.getCart()
  this.service.announceMission.subscribe(myBook=>
    this.transactions.push(myBook))
  }
  ex : number[] = []
  example : Price[]
  bookInfo(){
    let response = fetch(' http://localhost:3000/books')
      .then( prom => prom.json())
        .then( users => {
          // users.map(item=> item.price = item.price + '$')
          users.map(item=> this.allTiles.push(item))
        })
    
  }
  async addToCart(cart){
    let i = 0
    this.ex.length = 0 
    let response = await fetch(' http://localhost:3000/cart',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({name : cart.name, about: cart.about, price: cart.price, image: cart.image,  id: i++})
    })
    
    if(response.ok){
      this.localStore.getCart().then(el=> el.json()).then(data=> {

        if(data){
          data.map(item=> this.ex.push(item.price))
          if(this.ex.length != 0){
            this.cartLength = this.ex.reduce((a,b)=> a + b)
          }
        }

      } );
      
      
  }
}

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    alert(setPageSizeOptionsInput);
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  displayedColumns = ['item', 'cost'];
  transactions: Transaction[] = [
    
  ];
  ngOnInit() {
   fetch(' http://localhost:3000/cart').then(elem=> elem.json()).then(item=> this.transactions = item.reverse())
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

export interface Transaction {
  image: string;
  name: string;
}