import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service'
import { Router, ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: string = localStorage.currentUser
  constructor(private localStore : LocalStorageService, private route : Router) { 
    this.user = localStorage.currentUser
  }
  welcomePage(){
    return this.localStore.hide
  }
  logOut(){
    this.localStore.hide = true
    this.localStore.isCorrectSign = false
    localStorage.currentUser = ''
    this.welcomePage()
    return this.route.navigate(['/'])
  }
  // logOut(){
  //   return this.localStore.isCorrectData = true
  // }
  ngOnInit() {
    this.user = localStorage.currentUser
  }

}
