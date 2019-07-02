import { Component, OnInit } from "@angular/core";
import { Transaction } from "../interfaces";
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "../../environments/environment";
import { Toast } from "ngx-toastr";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "../main.service";
import { Book } from "../interfaces";
import { BookServiceService } from "../book-service.service";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
@Component({
  selector: "app-list-of-books",
  templateUrl: "./list-of-books.component.html",
  styleUrls: ["./list-of-books.component.scss"]
})
export class ListOfBooksComponent implements OnInit {
  idForEdit: number;
  switchBookPop: boolean = true;
  switchBooks: boolean = true;
  openPop: boolean = false;
  displayedColumns = ["id", "image", "name", "price", "buttons"];
  transactions: Transaction[] = [];
  booksDataSource = new MatTableDataSource<Transaction>();
  openPopForCurrentBook: boolean = false;
  constructor(
    private _toastr: ToastrService,
    private _mainService: LocalStorageService,
    private _bookService: BookServiceService,
    private http: HttpClient
  ) {}
  getTotalCost() {
    return this.transactions.map(t => t.price).reduce((acc, value) => acc + value, 0);
  }
  async remove(item) {
    await this._mainService.remove(item).subscribe(() => {
      let i = 0;
      for (const book of this.transactions) {
        book.id === item.id ? this.transactions.splice(i, 1) : null;
        i++;
      }
      this.booksDataSource = new MatTableDataSource<Transaction>(this.transactions);
    });
  }

  editBook(item) {
    localStorage.book = JSON.stringify(item);
    this._mainService.editBook();
    this._mainService.isEditButton = false;
  }
  exit() {
    this._mainService.editBook();
    this._mainService.isEditButton = false;
  }
  changeDataSource() {
    this.http.get(`${environment.apiUrl}books`).subscribe((item: Book[]) => {
      this.transactions = item;
      this.booksDataSource = new MatTableDataSource<Transaction>(item);
    });
  }
  ngOnInit() {
    this.changeDataSource();
    this._bookService.sendText.subscribe(x => {
      this.booksDataSource = new MatTableDataSource<Transaction>(
        this.transactions.filter(item => {
          return item.name.toLowerCase().indexOf(x) > -1 || item.price === +x;
        })
      );
    });
    this._bookService.observableEditBook.subscribe(x => {
      return this.changeDataSource();
    });
  }
}
