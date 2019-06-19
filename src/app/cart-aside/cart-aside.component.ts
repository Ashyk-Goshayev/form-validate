import { Component, OnInit } from '@angular/core';
import { BookServiceService } from '../book-service.service';
import { Book } from '../book-service.service';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-cart-aside',
  templateUrl: './cart-aside.component.html',
  styleUrls: ['./cart-aside.component.scss']
})
export class CartAsideComponent implements OnInit {

  constructor(private service : BookServiceService) { 
    
  }
  displayedColumns = ['image', 'name'];
  transactions: Transaction[] = [];
  ex : Transaction[] = [];
  dataSource = new MatTableDataSource<Transaction>();

  ngOnInit() {
    this.service.abservableBook.subscribe(x=> {
      this.transactions.unshift(x); 
      this.dataSource = new MatTableDataSource<Transaction>(this.transactions);
    });
  }
  getBook() {
    // localStorage.cart = JSON.stringify(this.ex)
    // this.transactions = JSON.parse(localStorage.cart).reverse()
    // setTimeout(()=> this.transactions.splice(this.transactions.length-1, 1), 1000)
  }
}
export interface Transaction {
  image: string;
  name: string;
}