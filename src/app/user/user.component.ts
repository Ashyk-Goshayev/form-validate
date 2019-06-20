import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user : string;
  show : string = 'none';
  switch : boolean = true;
  constructor(private localStore : LocalStorageService, private route : Router) { }
  showLog() { 
    if(this.switch) {
      this.show = 'block'
      // setTimeout(()=>this.show = 'none', 1000)
      this.switch = false;
    }else {
      this.show = 'none';
      this.switch = true
    }
  }
  logOut(){
    this.localStore.hide = true
    this.localStore.isCorrectSign = false
    localStorage.currentUser = ''
    this.localStore.hide
    return this.route.navigate(['/'])
  }
  ngOnInit() {
    this.user = localStorage.currentUser
  }

}
