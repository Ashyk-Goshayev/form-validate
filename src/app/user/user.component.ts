import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private localStore : LocalStorageService, private route : Router) { }
  logOut(){
    this.localStore.hide = true
    this.localStore.isCorrectSign = false
    localStorage.currentUser = ''
    this.localStore.hide
    return this.route.navigate(['/'])
  }
  ngOnInit() {
  }

}
