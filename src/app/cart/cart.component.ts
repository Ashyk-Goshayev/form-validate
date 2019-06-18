import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})



export class CartComponent implements OnInit {
  displayedColumns = ['id', 'image', 'name', 'price', 'buttons'];
  transactions: Transaction[]
  constructor(private service: LocalStorageService) {
    this.service.getCart().then(el=> el.json()).then(item=> this.transactions = item)
   }

  ngOnInit() {
  }
  getTotalCost() {
    return this.transactions.map(t => t.price).reduce((acc, value) => acc + value, 0);
  }
  async remove(row){
    // let response = await fetch(`http://localhost:3000/cart/${row.id}`,{
    //   method: 'DELETE',

    // });

    // if(response.ok){
      let i = 0;
      for (let current of this.transactions) {
        current.id == row.id ? this.transactions.splice(i, 1) : null
        i++
      }
    //}
  }

}

export interface Transaction {
  name: string;
  about: string;
  image: string;
  price: number;
  id: number
}