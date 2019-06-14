import { Component, OnInit } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import { LocalStorageService } from '../local-storage.service'
import { Router, ActivatedRoute } from '@angular/router'
export interface Tile {
  name: string,
  about: string,
  price: string,
  image: string
}

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})

export class BooksComponent implements OnInit {
  pageSize = 8;
  allTiles : Tile[] = [];
  tiles : Tile[] = [];
  pageSizeOptions: number[] = [8];

  pageIndex:number = 0;
  lowValue:number = 0;
  highValue:number = 8; 

 
  pageEvent: PageEvent;
  constructor(private localStore : LocalStorageService, private router : Router) {
  this.bookInfo()
  this.tiles = this.allTiles;
   }

  bookInfo(){
    let response = fetch(' http://localhost:3000/books')
      .then( prom => prom.json())
        .then( users => {
            users.map(item=> this.allTiles.push(item))
        })
    
  }
  
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    alert(setPageSizeOptionsInput);
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
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
