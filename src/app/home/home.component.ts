import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../main.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  showCart: boolean = true;
  constructor(private localStore: LocalStorageService, private route: Router) {}
  welcomePage() {
    this.showCart = this.localStore.hideCart;
    return this.localStore.hide;
  }

  ngOnInit() {}
}
