import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { BookServiceService } from '../book-service.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})



export class CartComponent implements OnInit {
  displayedColumns = ['id', 'image', 'name', 'price', 'buttons'];
  transactions: Transaction[]
  constructor(private service: LocalStorageService, private router: Router, private bookService : BookServiceService, private _location : Location ){
    this.transactions = JSON.parse(localStorage.cart)
   }
  popUpForRemove : string = 'none'
  switch : boolean = true
  index : number;
  ngOnInit() {
  }
  getTotalCost() {
    return this.transactions.map(t => t.price).reduce((acc, value) => acc + value, 0);
  }
  showPop(path = null){
    this.index = path
    if(this.switch) {
      this.popUpForRemove = 'flex';
      this.switch = false
    }else {
      this.popUpForRemove = 'none';
      this.switch = true
    }
  }
  remove() {
    let deleteRow = JSON.parse(localStorage.cart)
    deleteRow.splice(this.index, 1)
    localStorage.cart = JSON.stringify(deleteRow)
    this.transactions = deleteRow
    this.showPop()
  }
  goBack() {
    return this._location.back()
  }
  showRow(row) {
    this.bookService.openCurrentBook(row)
    this.router.navigate(['bookInfo', row.id])
  }
}

export interface Transaction {
  name: string;
  about: string;
  image: string;
  price: number;
  id: number
}