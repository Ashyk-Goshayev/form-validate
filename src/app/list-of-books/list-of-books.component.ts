import { Component, OnInit } from "@angular/core";
import { Transaction } from "../interfaces";
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "../../environments/environment";
import { Toast } from "ngx-toastr";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "../main.service";
import { Book } from "../interfaces";
import { BookServiceService } from "../book-service.service";
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
    private _bookService: BookServiceService
  ) {}
  getTotalCost() {
    return this.transactions
      .map(t => t.price)
      .reduce((acc, value) => acc + value, 0);
  }
  async remove(item) {
    this._mainService
      .remove(item)
      .then(elem => (this.transactions = elem))
      .then(
        () =>
          (this.booksDataSource = new MatTableDataSource<Transaction>(
            this.transactions
          ))
      );
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
    return fetch(`${environment.apiUrl}books`)
      .then(prom => prom.json())
      .then(item => {
        this.transactions = item;
      })
      .then(
        () =>
          (this.booksDataSource = new MatTableDataSource<Transaction>(
            this.transactions
          ))
      );
  }
  ngOnInit() {
    this._bookService.observableEditBook.subscribe(x => {
      return this.changeDataSource();
    });

    this.changeDataSource();
  }
}
