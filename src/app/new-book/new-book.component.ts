import { Component, OnInit } from '@angular/core';
import { BookServiceService } from '../book-service.service';
import { Book } from '../book-service.service';
import { Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment' 
@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.scss']
})
export class NewBookComponent implements OnInit {
  private subsc : Subscription
  constructor(private service : BookServiceService, private activroute: ActivatedRoute, private router : Router) { }
  book : any
  id: number
  ngOnInit() {
    this.subsc = this.activroute.params.subscribe(params=> {
      this.id = params['id']
      fetch(`${environment.apiUrl}books/${this.id}`).then(item=> item.json()).then(item=> this.book = item)
    })
  }
  goBack() {
    return this.router.navigate(['books'])
  }
}
