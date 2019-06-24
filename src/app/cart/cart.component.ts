import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../main.service";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { BookServiceService } from "../book-service.service";
import { Location } from "@angular/common";
import { Transaction } from "../interfaces";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit {
  displayedColumns = ["id", "image", "name", "price", "buttons"];
  transactions: Transaction[] = [];
  datasource = new MatTableDataSource<Transaction>();
  popUpForRemove: string = "none";
  switch: boolean = true;
  index: number;
  bookPrice: Transaction;
  constructor(
    private service: LocalStorageService,
    private router: Router,
    private bookService: BookServiceService,
    private _location: Location
  ) {
    if (localStorage.cart !== undefined) {
      this.datasource = JSON.parse(localStorage.cart);
      this.transactions = JSON.parse(localStorage.cart);
    }
  }

  ngOnInit() {
    this.bookService.sendText.subscribe(x => {
      this.datasource = new MatTableDataSource<Transaction>(
        this.transactions.filter(item => {
          return item.name.toLowerCase().indexOf(x) > -1 || item.price == +x;
        })
      );
    });
  }
  getTotalCost() {
    return this.transactions
      .map(t => t.price)
      .reduce((acc, value) => acc + value, 0);
  }
  showPop(element = null, path = null) {
    this.index = path;
    this.bookPrice = element;
    console.log(element);
    if (this.switch) {
      this.popUpForRemove = "flex";
      this.switch = false;
    } else {
      this.popUpForRemove = "none";
      this.switch = true;
    }
  }
  remove() {
    let deleteRow = JSON.parse(localStorage.cart);
    deleteRow.splice(this.index, 1);
    localStorage.cart = JSON.stringify(deleteRow);
    this.transactions = deleteRow;
    this.datasource = new MatTableDataSource<Transaction>(this.transactions);
    this.bookService.minusPriceMethod(this.bookPrice.price);
    this.showPop();
  }
  goBack() {
    return this._location.back();
  }
  showRow(row) {
    this.bookService.openCurrentBook(row);
    this.router.navigate(["bookInfo", row.id]);
  }
}
