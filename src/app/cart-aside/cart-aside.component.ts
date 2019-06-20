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
    this.transactions = JSON.parse(localStorage.cart);
    this.dataSource = new MatTableDataSource<Transaction>(this.transactions);
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
 
}
export interface Transaction {
  image: string;
  name: string;
}