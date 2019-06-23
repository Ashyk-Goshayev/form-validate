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
  uploadedImg : string = ''
  exampleForm : FormGroup;
  isInvalid : boolean = false;
  user : string[];
  isTrue : boolean = false
  isVisible : string = 'password'
  isSwitched : boolean = true
  constructor(private formBuilder: FormBuilder, private localStore : LocalStorageService, private router : Router) { 
  this.createForm();
  this.user = [];
  }
  file : File = null;
  image : any;
  getURL(img){
    var reader = new FileReader()
    this.file = <File>img.files[0]
    if(this.file){
      reader.readAsDataURL(this.file)
    }else{
      alert('no')
    }
    reader.onload= ()=>{
      this.uploadedImg = 'none'
      this.image = reader.result
    };
  }
  onsubmit(){
    this.localStore.onsubmitReg(this.exampleForm.value, this.image)
    if(this.localStore.isSuccess){
      return this.router.navigate(['signIn'])
    }
    
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
