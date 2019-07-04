import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorageService } from "../main.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { config } from "rxjs";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"]
})
export class SignInComponent implements OnInit {
  exampleForm: FormGroup;
  isInvalid: boolean = false;
  isTrue: string = "text";
  isVisible: string = "password";
  isSwitched: boolean = true;
  isClient: string;
  constructor(
    private formBuilder: FormBuilder,
    private localStore: LocalStorageService,
    private route: Router,
    private activ: ActivatedRoute,
    private _http: HttpClient
  ) {
    this.createForm();
  }

  showPassword() {
    if (this.isSwitched) {
      this.isVisible = "text";
      return (this.isSwitched = false);
    } else {
      this.isVisible = "password";
      return (this.isSwitched = true);
    }
  }

  onsubmit() {
    // this.localStore.show().subscribe(x => {
    //   console.log("yes");
    // });
    this.localStore.onsubmitSign(this.exampleForm.value);
    if (this.localStore.isCorrectSign) {
      return this.route.navigate(["/books"]);
    } else if (this.localStore.isAdminLogin) {
      return this.route.navigate(["/admin"]);
    } else {
      return this.route.navigate(["signIn"]);
    }
  }

  createForm() {
    this.exampleForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ngOnInit() {}
}
