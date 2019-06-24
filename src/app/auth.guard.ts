import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { LocalStorageService } from "./main.service";
import { CanActivate, Router } from "@angular/router";
import { Location } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private localStore: LocalStorageService,
    private router: Router,
    private location: Location
  ) {
    this.canActivate();
  }

  canActivate(): boolean {
    if (
      localStorage.currentUser !== undefined &&
      localStorage.currentUser !== ""
    ) {
      if (JSON.parse(localStorage.currentUser)[0].email === "admin@gmail.com") {
        return true;
      } else {
        this.router.navigate(["books"]);
        return false;
      }
    } else {
      this.router.navigate(["signIn"]);
      return false;
    }
  }
}
