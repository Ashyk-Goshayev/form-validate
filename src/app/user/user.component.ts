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
  img : string;
  hasImage : string;
  show : string = 'none';
  constructor(private localStore : LocalStorageService, private route : Router) { 
    this.user = JSON.parse(localStorage.currentUser)[0].email.split(/@/g)[0]
    if(JSON.parse(localStorage.currentUser)[0].image){
      this.hasImage = 'none';
      this.img = JSON.parse(localStorage.currentUser)[0].image
    }else {
      this.hasImage = ''
    }
    
  }
  showLog() { 
      this.show = 'block'
      setTimeout(()=>this.show = 'none', 2000)
  }
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
