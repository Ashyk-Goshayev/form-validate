import { Component, OnInit } from '@angular/core';
import { BookServiceService } from '../book-service.service'
@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss']
})
export class CartIconComponent implements OnInit {
  constructor(private service: BookServiceService) { }
  price: number = 0
  ngOnInit() {
    this.service.abservableBook.subscribe(x=> this.price += x.price)
  }
  showPrice() {
    console.log(this.price)
  }

}
