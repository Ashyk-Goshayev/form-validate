import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { LocalStorageService } from "../main.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../environments/environment";
import { Book } from "../interfaces";
import { Subscription } from "rxjs";
import { BookServiceService } from "../book-service.service";
import { HttpClient } from "@angular/common/http";
import { NgxImageCompressService } from "ngx-image-compress";
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
    private http: HttpClient,
    private imageCompress: NgxImageCompressService
  ) {
    this.createForm();
  }
  compressFile() {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      console.warn("Size in bytes was:", this.imageCompress.byteCount(image));
      this.imageCompress.compressFile(image, orientation, 50, 50).then(result => {
        if (this.imageCompress.byteCount(result) < 25000) {
          this.imageCompress.compressFile(image, orientation, 50, 100).then(res => {
            console.warn("Size in bytes is now:", this.imageCompress.byteCount(res));
            this.image = res;
            this.showImage = true;
            this.hideLogo = false;
            this._toastr.success("Loaded");
            this.photoOfBook = res;
          });
        } else {
          this.image = result;
          this.showImage = true;
          this.hideLogo = false;
          this.photoOfBook = result;
          this._toastr.success("Loaded");
          console.warn("Size in bytes is now:", this.imageCompress.byteCount(result));
        }
      });
    });
  }

  addBook() {
    this._mainService.addBook(this.BooksForm.value, this.image);
    this.showImage = false;
    this.hideLogo = true;
    this.openBook();
  }
  book: Book;
  formData = new FormData();
  selectedFile: File;

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
