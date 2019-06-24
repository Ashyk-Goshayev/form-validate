import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../main.service";
import { environment } from "src/environments/environment";
import { Location } from "@angular/common";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BookServiceService } from "../book-service.service";

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
  showEditImg: boolean = true;
  editForm: FormGroup;
  showEdit: string = "none";
  switch: boolean = true;
  currentEmail: string;
  currentPassword: string;
  id: number;
  file: File = null;
  img: any;
  constructor(
    private service: LocalStorageService,
    private _location: Location,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private bookService: BookServiceService
  ) {
    // this.showImg = true;
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

  getURL(img) {
    var reader = new FileReader();
    this.file = <File>img.files[0];
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
    reader.onload = () => {
      this.showEditImg = false;
      this.img = reader.result;
    };
  }
  async confirm() {
    var testEmail = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    var testPass = /[a-zA-Z0-9]/g;
    var sameUser = null;
    if (this.editForm.value.email === null) {
      this.editForm.value.email = this.email;
    }
    if (this.editForm.value.password === null) {
      this.editForm.value.password = this.password;
    }
    if (this.img === undefined) {
      this.img = this.image;
    }

    this.service
      .getData()
      .then(users => {
        sameUser = users.filter(
          item => item.email === this.editForm.value.email.email
        );
      })
      .then(() => {
        if (
          testEmail.test(this.editForm.value.email) &&
          testPass.test(this.editForm.value.password) &&
          this.editForm.value.password !== "" &&
          this.editForm.value.email !== ""
        ) {
          if (
            JSON.parse(localStorage.currentUser).email ===
              this.editForm.value.email ||
            sameUser.length === 0
          ) {
            fetch(
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
            ).then(() => {
              localStorage.currentUser = JSON.stringify([
                Object.assign(
                  { id: JSON.parse(localStorage.currentUser)[0].id },
                  this.editForm.value,
                  { image: this.img }
                )
              ]);
              this.email = this.editForm.value.email;
              this.name = this.editForm.value.email.split(/@/g)[0];
              if (this.img !== undefined) {
                this.showImg = false;
                this.image = this.img;
              } else {
                this.showImg = true;
              }
              this.toastr.success("Your data edited");
              this.bookService.sendCurrentUser(
                JSON.parse(localStorage.currentUser)
              );
              this.editPopUp();
            });
          } else {
            this.toastr.error("User exists", "WARNING!");
          }
        } else {
          this.toastr.error(
            "email should be like example@gmail.com",
            "WARNING!"
          );
        }
      });
  }
  createForm() {
    this.editForm = this.formBuilder.group({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit() {
    fetch(
      `${environment.apiUrl}users/${JSON.parse(localStorage.currentUser)[0].id}`
    )
      .then(item => item.json())
      .then(elem => {
        this.email = elem.email;
        this.password = elem.password;
        this.name = elem.email.split(/@/g)[0];
        if (elem.image !== undefined) {
          this.showImg = false;
          this.image = elem.image;
        } else {
          this.showImg = true;
        }
      });
  }
}
