import { Component, OnInit } from "@angular/core";
import { BookServiceService } from "../book-service.service";
import { MatTableDataSource } from "@angular/material/table";
import { Transaction } from "../interfaces";

@Component({
  selector: "app-cart-aside",
  templateUrl: "./cart-aside.component.html",
  styleUrls: ["./cart-aside.component.scss"]
})
export class CartAsideComponent implements OnInit {
  displayedColumns = ["image", "name"];
  transactions: Transaction[] = [];
  ex: Transaction[] = [];
  dataSource = new MatTableDataSource<Transaction>();

  constructor(private service: BookServiceService) {
    if (localStorage.cart !== undefined) {
      this.transactions = JSON.parse(localStorage.cart);
      this.dataSource = new MatTableDataSource<Transaction>(this.transactions);
    }
  }

  ngOnInit() {
    this.service.abservableBook.subscribe(x => {
      this.transactions.unshift(x);
      this.dataSource = new MatTableDataSource<Transaction>(this.transactions);
    });
  }
}
