import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../local-storage.service";
import { environment } from "src/environments/environment";
import { Location } from "@angular/common";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Toast, ToastrService } from "ngx-toastr";
import { BookServiceService } from "../book-service.service";

var er = null;
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  image: any;
  name: string;
  email: string;
  password: string;
  showImg: boolean;
  editForm: FormGroup;
  showEdit: string = "none";
  switch: boolean = true;
  constructor(
    private service: LocalStorageService,
    private _location: Location,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private bookService: BookServiceService
  ) {
    this.showImg = true;
    this.createForm();
  }
  goBack() {
    return this._location.back();
  }
  editPopUp() {
    if (this.switch) {
      this.showEdit = "flex";
      this.switch = false;
    } else {
      this.showEdit = "none";
      this.switch = true;
    }
  }
  file: File = null;
  img: any;
  getURL(img) {
    var reader = new FileReader();
    this.file = <File>img.files[0];
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
    reader.onload = () => {
      this.img = reader.result;
    };
  }
  async confirm() {
    var testEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var testPass = /[a-zA-Z0-9]/g;
    let isSameUser = this.service.users.filter(
      item => item.email === this.editForm.value.email
    );
    if (isSameUser.length >= 1) {
      this.toastr.error("User exist", "WARNING!");
    } else if (
      testEmail.test(this.editForm.value.email) &&
      testPass.test(this.editForm.value.password)
    ) {
      let response = await fetch(
        `${environment.apiUrl}users/${
          JSON.parse(localStorage.currentUser)[0].id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            Object.assign(this.editForm.value, { image: this.img })
          )
        }
      );
      if (response.ok) {
        localStorage.currentUser = JSON.stringify([
          Object.assign(
            { id: JSON.parse(localStorage.currentUser)[0].id },
            this.editForm.value,
            { image: this.img }
          )
        ]);
        this.email = this.editForm.value.email;
        this.name = this.editForm.value.email.split(/@/g)[0];
        this.image = this.img;
        this.toastr.success("Your data edited");
        this.bookService.sendCurrentUser(JSON.parse(localStorage.currentUser));
        this.editPopUp();
      }
    } else {
      this.toastr.error("email should be like example@gmail.com", "WARNING!");
    }
  }
  createForm() {
    this.editForm = this.formBuilder.group({
      email: new FormControl(),
      password: new FormControl()
    });
  }
  id: number;
  ngOnInit() {
    fetch(
      `${environment.apiUrl}users/${JSON.parse(localStorage.currentUser)[0].id}`
    )
      .then(item => item.json())
      .then(elem => {
        this.email = elem.email;
        this.password = elem.password;
        this.name = elem.email.split(/@/g)[0];
        if (elem.image) {
          this.showImg = false;
          this.image = elem.image;
        }
      });
  }
}
