import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})



export class CartComponent implements OnInit {
  displayedColumns = ['id', 'image', 'name', 'price', 'buttons'];
  transactions: Transaction[]
  constructor(private service: LocalStorageService, private router: Router) {
    this.transactions = JSON.parse(localStorage.cart)
   }

  ngOnInit() {
  }
  getTotalCost() {
    return this.transactions.map(t => t.price).reduce((acc, value) => acc + value, 0);
  }
  remove(row, path){
    let deleteRow = JSON.parse(localStorage.cart)
    deleteRow.splice(path, 1)
    localStorage.cart = JSON.stringify(deleteRow)
    this.transactions = deleteRow
  }
  goBack() {
    return this.router.navigate(['books'])
  }

}

export interface Transaction {
  name: string;
  about: string;
  image: string;
  price: number;
  id: number
}