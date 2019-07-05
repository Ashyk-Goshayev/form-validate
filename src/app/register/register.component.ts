import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorageService } from "../main.service";
import { Router } from "@angular/router";
import { User } from "../interfaces";
import { ToastrService } from "ngx-toastr";
import { NgxImageCompressService } from "ngx-image-compress";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent {
  uploadedImg: string = "";
  exampleForm: FormGroup;
  isInvalid: boolean = false;
  user: string[];
  isTrue: boolean = false;
  isVisible: string = "password";
  isSwitched: boolean = true;
  file: File = null;
  image: any;
  constructor(
    private formBuilder: FormBuilder,
    private _mainService: LocalStorageService,
    private router: Router,
    private _toastr: ToastrService,
    private imageCompress: NgxImageCompressService
  ) {
    this.createForm();
    this.user = [];
  }
  compressFile() {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      // this.imgResultBeforeCompress = image;
      console.warn("Size in bytes was:", this.imageCompress.byteCount(image));
      this.imageCompress.compressFile(image, orientation, 50, 50).then(result => {
        // this.imgResultAfterCompress = result;

        if (this.imageCompress.byteCount(result) < 25000) {
          this.uploadedImg = "none";
          this.imageCompress.compressFile(image, orientation, 50, 50).then(res => {
            console.warn("Size in bytes is now:", this.imageCompress.byteCount(res));
            this.image = res;
          });
        } else {
          this.uploadedImg = "none";
          this.image = result;
          console.warn("Size in bytes is now:", this.imageCompress.byteCount(result));
        }
      });
    });
  }
  getURL(img) {
    var reader = new FileReader();
    this.file = <File>img.files[0];
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
    reader.onload = () => {
      this.uploadedImg = "none";
      this.image = reader.result;
    };
  }
  onsubmit() {
    this._mainService.onsubmitReg(this.exampleForm.value, this.image).then(() =>
      this._mainService.getData().subscribe((users: User[]) => {
        this._mainService.users = users;
      })
    );
    if (this._mainService.isSuccess) {
      return this.router.navigate(["signIn"]);
    }
  }
  createForm() {
    this.exampleForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
      passwordRepeat: ["", Validators.required]
    });
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
}
