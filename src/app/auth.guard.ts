import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service'
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private localStore : LocalStorageService, private router : Router ){
    this.canActivate()
  }
  canActivate(): boolean {
    if(localStorage.currentUser === 'admin@gmail.com'){
      return true
    }else{
      this.router.navigate(['signIn'])
      return false
    }
  }
}
