import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service'
import { CanActivate, Router } from '@angular/router';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private localStore : LocalStorageService, private router : Router, private location : Location ){
    this.canActivate()
  }
  canActivate(): boolean {
    if(JSON.parse(localStorage.currentUser)[0].email === 'admin@gmail.com'){
      return true
    }else if(localStorage.currentUser != null && JSON.parse(localStorage.currentUser)[0].email !== 'admin@gmail.com'){
        this.router.navigate(['books'])
        return false
    }
    else{
      this.router.navigate(['signIn'])
      return false
    }
  }
}
