import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
@Injectable({
  providedIn: "root"
})
export class ShopGuardsService implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (
      localStorage.currentUser !== undefined &&
      localStorage.currentUser !== ""
    ) {
      if (JSON.parse(localStorage.currentUser)[0].email !== "admin@gmail.com") {
        return true;
      } else {
        this.router.navigate(["admin"]);
        return false;
      }
    } else {
      this.router.navigate(["signIn"]);
      return false;
    }
  }
}
