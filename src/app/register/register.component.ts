import { Component, OnInit, Output } from '@angular/core';
import {  FormGroup, FormBuilder, Validators} from '@angular/forms';
import { LocalStorageService } from '../local-storage.service'
import { Router, ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  exampleForm : FormGroup;
  isInvalid : boolean = false;
  user : string[];
  isTrue : boolean = false
  isVisible : string = 'password'
  isSwitched : boolean = true
  constructor(private formBuilder: FormBuilder, private localStore : LocalStorageService) { 
  this.createForm();
  this.user = [];
  }
 
  // welcomePage(){
  //   return this.localStore.isReg
  // }
  onsubmit(){
    this.localStore.onsubmitReg(this.exampleForm.value)
  }
  createForm() {
    this.exampleForm = this.formBuilder.group({
      email : ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required]
    });
  }

  showPassword(){
    if(this.isSwitched){
      this.isVisible = 'text'
      return this.isSwitched = false
    }else{
      this.isVisible = 'password'
      return this.isSwitched = true
    }
  }
  ngOnInit() {
  }

}
