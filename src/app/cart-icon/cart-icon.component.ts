import { Component, OnInit } from "@angular/core";
import { BookServiceService } from "../book-service.service";
import { isArray } from "util";

@Component({
  selector: "app-cart-icon",
  templateUrl: "./cart-icon.component.html",
  styleUrls: ["./cart-icon.component.scss"]
})
export class CartIconComponent implements OnInit {
  price = 0;
  constructor(private service: BookServiceService) {
    if (localStorage.cart !== undefined) {
      if (!isArray(JSON.parse(localStorage.cart))) {
        return (this.price = JSON.parse(localStorage.cart).price);
      } else {
        let arrayofPrice = JSON.parse(localStorage.cart);
        arrayofPrice = arrayofPrice.map(item => {
          return item.price;
        });
        this.price = arrayofPrice.reduce((a, b) => a + b);
      }
    }
  }

  ngOnInit() {
    this.service.abservableBook.subscribe(x => (this.price += x.price));
    this.service.sendPrice.subscribe(x => (this.price += x));
    this.service.sendMinusPrice.subscribe(x => (this.price -= x));
  }
}
