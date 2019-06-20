import { Component, OnInit } from '@angular/core';
import { BookServiceService } from '../book-service.service';
import { Book } from '../book-service.service';
import { Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment' 
import { Location } from '@angular/common';
@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.scss']
})
export class NewBookComponent implements OnInit {
  private subsc : Subscription
  constructor(private service : BookServiceService, private activroute: ActivatedRoute, private router : Router, private _location : Location) { }
  book : any
  id: number
  ngOnInit() {
    this.subsc = this.activroute.params.subscribe(params=> {
      this.id = params['id']
      fetch(`${environment.apiUrl}books/${this.id}`).then(item=> item.json()).then(item=> this.book = item)
    })
  }
  buy(item, obj) {
    let cart = JSON.parse(localStorage.cart)
    cart.push(obj)
    localStorage.cart = JSON.stringify(cart)
    this.service.sendBookPrice(item)
  }
  goBack() {
    return this._location.back()
  }
}
