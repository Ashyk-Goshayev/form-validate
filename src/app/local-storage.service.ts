import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PeriodicElement } from './admin/admin.component'
import { Router } from '@angular/router'
import { __param } from 'tslib';
import { environment } from '../environments/environment' 
export interface Admin {
  email: string;
  password: string;
}
export interface Price {
  name: string,
  about: string,
  price: number,
  image: string
}
export interface User {
  id: number,
  email: string,
  password: string;
}

export interface List {
  position: number,
  email: string, 
  password: string,
  delete: string,
  edit: string
}
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  arrayOfUsers : object[]
  admin : Admin = {
    email : 'admin@gmail.com',
    password : 'admin'
  }
  user_2 : User[]
  hideCart: boolean = true
  books : Price[]

  isCorrectSign : boolean = false // for navigate to books page
  hide : boolean = true // for hide buttons
  isAdminLogin : boolean = false
  constructor(private toastr: ToastrService, private router : Router) {
    this.arrayOfUsers = []
    this.getData()
    if(localStorage.currentUser != ''){
      if(localStorage.currentUser === 'admin@gmail.com'){
        this.hide = false
        this.hideCart = false
        this.isAdminLogin = true
      }else{
        this.isCorrectSign = true
        this.hide = false
        this.hideCart = true
      }
    }
    
  }

  async getData(){
    return fetch(`${environment.apiUrl}users`);
    

  }
  isSuccess : boolean = false;
  async onsubmitReg(formInput : {email : string, password : string, passwordRepeat : string}, img: any){
    return this.getData().then( prom => prom.json())
    .then( users => {
      users = users;
      var testEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var testPass = /[a-zA-Z0-9]/g;
      let isSameUser = users.filter(item=> item.email === formInput.email)
      if(isSameUser.length >= 1){
        return this.toastr.error('User exist', 'WARNING!')
      }
      else if(testEmail.test(formInput.email) && testPass.test(formInput.password)){
        if(formInput.password === formInput.passwordRepeat){
          fetch(`${environment.apiUrl}users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: formInput.email, password: formInput.password, image: img})
          }).then( ()=>{
            this.isSuccess = true;
            this.hideCart = true;
            this.toastr.success('Registration passed', 'SUCCESS')
          } )
          
        }else{

          this.toastr.error('Passwords do not match', 'WARNING!')
        }
      }else{

          this.toastr.error('email should be like example@gmail.com', 'WARNING!')
        }

    });



    
    }
  
  id : number;
  onsubmitSign(inputForm : {email : string, password : string}){
  return this.getData().then( prom => prom.json())
  .then( users => {
    users = users;
    if(users != null || this.admin != null){
      if(users != null && this.admin.email !== inputForm.email || this.admin.password !== inputForm.password){
        let user ;
        user = users.filter(elem=>{ return elem.email == inputForm.email ? elem.password == inputForm.password : null})       
        if(user.length >= 1){
          localStorage.currentUser = JSON.stringify(user)
          this.hideCart = true
          this.isCorrectSign = true
          this.hide = false
          this.toastr.success(`Welcome `, 'SUCCESS')
        }else{
          this.toastr.error('email or password is wrong', 'WARNING!')
        }
      }else if(this.admin.email === inputForm.email && this.admin.password === inputForm.password){
        localStorage.currentUser = JSON.stringify([{email: this.admin.email}])
        this.hideCart = false
        this.hide = false
        this.isAdminLogin = true
        this.toastr.success(`Welcome admin`, 'SUCCESS')
        }
    }
    else {
      this.toastr.error('you dont have accaunt', 'WARNING!')
    }    
  })
  
  }
}



