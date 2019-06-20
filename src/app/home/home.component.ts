import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service'
import { Router, ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private localStore : LocalStorageService, private route : Router) { 
    
  }
  welcomePage(){
    return this.localStore.hide
  }
  
  // logOut(){
  //   return this.localStore.isCorrectData = true
  // }
  ngOnInit() {
    
  }

}
