import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PeriodicElement } from './admin/admin.component'
import { Router } from '@angular/router'
import { __param } from 'tslib';
export interface Admin {
  email: string;
  password: string;
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
  currentUser : string;
  admin : Admin = {
    email : 'admin@gmail.com',
    password : 'admin'
  }
  user_2 : User[]



  isCorrectSign : boolean = false // for navigate to books page
  hide : boolean = true // for hide buttons
  isAdminLogin : boolean
  constructor(private toastr: ToastrService, private router : Router) {
    this.arrayOfUsers = []
    this.getData()
      
    // if(localStorage.current != null){
    //   var lastUser = JSON.parse(localStorage.current)
    //   this.currentUser = lastUser.email
    //   this.isCorrectSign = true
    //   this.hide = false
    // }else{
     
    // }
    
  }

  getData(){
    fetch(' http://localhost:3000/users')
    .then( prom => prom.json())
      .then( users => {
        this.user_2 = users
      })

  }

  onsubmitReg(formInput : {email : string, password : string, passwordRepeat : string}){
    var testEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var testPass = /[a-zA-Z0-9]/g;
    if(testEmail.test(formInput.email) && testPass.test(formInput.password)){
      if(formInput.password == formInput.passwordRepeat){
        fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: formInput.email, password: formInput.password})
        })
        
        // this.arrayOfUsers.push(formInput)
        // var thuser = JSON.stringify(this.arrayOfUsers)
        // localStorage.users = thuser;
        // localStorage.current = JSON.stringify(JSON.parse(localStorage.users)[JSON.parse(localStorage.users).length-1])
        this.toastr.success('Registration passed', 'SUCCESS')
      }else{
        this.toastr.error('Passwords do not match', 'WARNING!')
      }
    }else{
        this.toastr.error('email should be like example@gmail.com', 'WARNING!')
      }
    }
  

  onsubmitSign(inputForm : {email : string, password : string}){
    this.getData()
    if(this.user_2 != null || this.admin != null){
      if(this.user_2 != null && this.admin.email != inputForm.email ){
        var user ;
  
          
        
        // var isAdmin = JSON.parse(localStorage.adminInfo)
        user = this.user_2.filter(elem=>{ return elem.email == inputForm.email ? elem.password == inputForm.password : null})
        
        if(user.length >= 1){
          this.currentUser = user[0].email
          this.isCorrectSign = true
          this.hide = false
          this.toastr.success(`Welcome `, 'SUCCESS')
          // this.isCorrectData = false;
          // this.isLogin = true
        }
      }else if(this.admin.email == inputForm.email && this.admin.password == inputForm.password){
      this.currentUser = this.admin.email
      // this.isCorrectSign = false
      this.hide = false
      this.isAdminLogin = true
      this.toastr.success(`Welcome admin`, 'SUCCESS')
      }
      else{
        // this.isClient = false
        // this.isCorrectSign = false
        this.toastr.error('email or password is wrong', 'WARNING!')
      }
      

    }
    else {
      this.toastr.error('you dont have accaunt', 'WARNING!')
    }    
  }
  
  
}



