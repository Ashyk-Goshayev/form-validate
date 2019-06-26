import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { LocalStorageService } from "../main.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../environments/environment";
import { Book } from "../interfaces";
import { Subscription } from "rxjs";
import { BookServiceService } from "../book-service.service";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-pop-for-books",
  templateUrl: "./pop-for-books.component.html",
  styleUrls: ["./pop-for-books.component.scss"]
})
export class PopForBooksComponent implements OnInit {
  subscription: Subscription;
  BooksForm: FormGroup;
  bookName: string;
  bookAbout: string;
  bookPrice: number;
  photoOfBook: string;
  bool: boolean;
  showImage: boolean = false;
  file: File = null;
  image: string;
  hideLogo: boolean = true;
  currentBook: Book;
  constructor(
    private _formBuilder: FormBuilder,
    private _mainService: LocalStorageService,
    private _toastr: ToastrService,
    private _bookService: BookServiceService,
    private http: HttpClient
  ) {
    this.createForm();
  }
  addBook() {
    this._mainService.addBook(this.BooksForm.value, this.image);
    this.showImage = false;
    this.hideLogo = true;
    this.openBook();
  }
  book: Book;
  getURL(img) {
    const reader = new FileReader();
    this.file = img.files[0] as File;
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
    reader.onload = () => {
      this.image = <string>reader.result;
      this.showImage = true;
      this.hideLogo = false;
      this.photoOfBook = <string>reader.result;
      this._toastr.success("Loaded");
    };
  }
  async editCurrentBook() {
    if (!this.BooksForm.value.name || !this.BooksForm.value.price) {
      this._toastr.error("Fill empty inputs", "WARNING");
      return;
    }
    this.http
      .put(`${environment.apiUrl}books/${JSON.parse(localStorage.book).id}`, Object.assign(this.BooksForm.value, { image: this.image }))
      .subscribe((x: Book) => {
        this._bookService.getBookValue(x);
        this._mainService.editBook();
      });
  }
  createForm() {
    this.BooksForm = this._formBuilder.group({
      name: new FormControl(),
      about: new FormControl(),
      price: new FormControl()
    });
  }
  openBook() {
    this.bool = true;
    return this._mainService.openBook();
  }

  ngOnInit() {}
}