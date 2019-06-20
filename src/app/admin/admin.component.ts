import { Component, OnInit } from '@angular/core';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { LocalStorageService } from '../local-storage.service';
import { Router, NavigationEnd} from '@angular/router'
import { Location } from '@angular/common'
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from "rxjs"
import { environment } from '../../environments/environment' 
import { BookServiceService } from '../book-service.service';
import {PageEvent} from '@angular/material/paginator';
export interface PeriodicElement {
  email: string;
  position: number;
  password: string;
  delete: string;
  edit: string;
}
export interface Transaction {
 id: number;
 image: string;
 name: string;
}
export interface Tile {
  name: string,
  about: string,
  price: number,
  image: string
}

let ELEMENT_DATA: PeriodicElement[] = []
export interface User {
  id: number,
  email: string,
  password: string;
};
export interface User {
  email: string,
  password: string
}

export interface Books {
  name: string,
  about: string,
  price: number,
  image: string;
};
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isDisplayed : string = 'none' // for add User
  isDisplayedPop : string = 'none'  // for delete user
  switch : boolean = true
  switchPop : boolean = true
  position : number = 0
  deleteUser : object
  editUser : string = 'none' // for edit user
  switchEdit : boolean = true
  newBook : string = 'none' // for adding new book
  switchBookPop : boolean = true
  displayedColumns: string[] = ['select', 'position', 'email', 'password', 'delete', 'edit'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  passValue : string;
  loginValue : string
  exampleForm : FormGroup
  deleteAll : string;
  photoOfBook : any;

  pageSize = 3;
  allTiles : Tile[] = [];
  tiles : Tile[] = [];
  pageSizeOptions: number[] = [3];
  pageIndex:number = 0;
  lowValue:number = 0;
  highValue:number = 3; 
  pageEvent: PageEvent;
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    alert(setPageSizeOptionsInput);
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  getPaginatorData(event){
    console.log(event);
    if(event.pageIndex === this.pageIndex + 1){
       this.lowValue = this.lowValue + this.pageSize;
       this.highValue =  this.highValue + this.pageSize;
      }
   else if(event.pageIndex === this.pageIndex - 1){
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue =  this.highValue - this.pageSize;
     }   
      this.pageIndex = event.pageIndex;
}
  showSelected(){
    if(this.selection.selected.length > 0){
      this.deleteAll = 'block'
    }else{
      this.deleteAll = 'none'
    }
  }
  displayedColumnss = ['id', 'image', 'name', 'buttons'];
  transactions: Transaction[] = [
    {id:1, image:'asdasd', name: 'sadasd'}
  ];
  getTotalCost() {
    return this.transactions.map(t => t.id).reduce((acc, value) => acc + value, 0);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  file : File = null
  image: any
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}` ;
  }
  addBook(){
    if(this.exampleForm.value.name !== null && this.exampleForm.value.price !== null){
      fetch(`${environment.apiUrl}books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(Object.assign(this.exampleForm.value, { image: this.image} ))
      })
      console.log(this.image)
      this.uploaded = 'flex'
      this.opacity = '0'
      this.openBook()
      this.toastr.success('new book added', 'Success')
    }else{
      this.toastr.error('Fill empty inputs','WARNING')
    }
    
  }

  uploaded : string;
  opacity : string;
  getURL(img){
    var reader = new FileReader()
    this.file = <File>img.files[0]
    if(this.file){
      reader.readAsDataURL(this.file)
    }else{
      alert('no')
    }
    reader.onload= ()=>{
      this.image = reader.result
      this.photoOfBook = reader.result;
      this.uploaded = 'none';
      this.opacity = '1';
      this.toastr.success('Loaded')
    };
  }
  async deleteAllSelected(){
    let users = this.selection.selected
    let response = null;
    for (let u of users) {
      response = await fetch(`${environment.apiUrl}users/${u.position}`, {
        method: 'DELETE'
      });
    }
    if(response.ok){
      for (let u of users) {
        let el = ELEMENT_DATA.filter((x) => { return x.position === u.position})[0];
        ELEMENT_DATA.splice(ELEMENT_DATA.indexOf(el) , 1)
      }
      this.dataSource.data = ELEMENT_DATA;
    }
  }
  isSorted : boolean = true

  sortByNo() {
    if(this.isSorted){
      ELEMENT_DATA = ELEMENT_DATA.sort((a, b)=>{
        if(a.position > b.position) {
          return -1
        }else if(a.position < b.position) {
          return 1
        }
        return 0
      })
      this.isSorted = false
      return this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    }else {
      ELEMENT_DATA = ELEMENT_DATA.sort((a, b)=>{
        if(a.position < b.position) {
          return -1
        }else if(a.position > b.position) {
          return 1
        }
        return 0
      })
      this.isSorted = true
      return this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    }
    
    
    
  }
  async deleteRow(){
    let user;
    user = this.deleteUser
    let response  = await fetch(`${environment.apiUrl}users/${user.position}`, {
              method: 'DELETE'
    });
    
    if(response.ok){
      let i = 0;
      for (let current of this.dataSource.filteredData) {
        current.position == user.position ? ELEMENT_DATA.splice(i, 1) : null
        i++
      }
      this.dataSource.data = ELEMENT_DATA;
      this.openDialog()
    }else{
      alert('not deleted')
    }

  }
  editValue(row){
    if(this.switchEdit){
      this.editUser = 'flex'
      this.switchEdit = false
      this.passValue = row.password
      this.loginValue = row.email
      this.position = row.position
    }else {
      this.editUser = 'none'
      this.switchEdit = true
    }
    
  }
  openBook(){
    if(this.switchBookPop){
      this.newBook = 'flex'
      this.switchBookPop = false
    }else {
      this.newBook = 'none'
      this.switchBookPop = true
    }
  }
  togglePop(){
    if(this.switch){
      this.isDisplayed = 'flex'
      this.switch = false
    }else {
      this.isDisplayed = 'none'
      this.switch = true
    }
  }
  confirm(em, pass){
    fetch(`${environment.apiUrl}users/${this.position}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({email: em, password: pass})
    })
    this.editCurrentUser({email: em, password: pass , id: this.position});
  }
  async openSnackBar(email : string, password : string){
    let isSameUser = this.localStore.user_2.filter(item=> item.email === email)
    if(isSameUser.length === 0){
      let result = await fetch(`${environment.apiUrl}users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({email: email, password: password})
            })
      if(result.ok){
        await this.addUser({email: email, password: password})
        await this.togglePop()
      }
    }else{
      this.toastr.error('User exist', 'WARNING')
    }
      
     
  }
  constructor(private localStore : LocalStorageService, private formBuilder: FormBuilder, private toastr: ToastrService, private router : Router, private location: Location, private bookService : BookServiceService) {
    this.createForm();

  }
  
  openDialog(row = null) {
    this.deleteUser = row

    if(this.switchPop){
      this.isDisplayedPop = 'flex'
      this.switchPop = false
    }else {
      this.isDisplayedPop = 'none'
      this.switchPop = true
    }
  }
  createForm() {
    this.exampleForm = this.formBuilder.group({
      name : new FormControl,
      about: new FormControl,
      price: new FormControl
    });
  }
  
  async addUser(user){

    ELEMENT_DATA.push({email : user.email, delete: "delete", edit: "edit",password : user.password, position: ELEMENT_DATA.length + 1  });  
    this.dataSource.data = ELEMENT_DATA;
  }
  editCurrentUser(user){
    let oldUser = ELEMENT_DATA.filter( (x) => {  return x.position === user.id } )[0];
    if(oldUser){
      oldUser.email = user.email
    }
    
   
    this.dataSource.data = ELEMENT_DATA;
  }
  
  ngOnInit() {
    // this.localStore.getData()
    ELEMENT_DATA.length = 0
    // for (let i = 0; i < this.localStore.user_2.length; i++) {
    //   ELEMENT_DATA.push({email : this.localStore.user_2[i].email, delete: "delete", edit: "edit",password : this.localStore.user_2[i].password, position: this.localStore.user_2[i].id  });    
    // }
    // this.dataSource.data = ELEMENT_DATA;
    
     fetch(`${environment.apiUrl}users`)
      .then( prom => prom.json())
        .then( users => {
            users.map(item=> ELEMENT_DATA.push({email : item.email, delete: "delete", edit: "edit",password : item.password, position: item.id  }))
        }).then( () =>
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA)
        )
        this.bookService.sendText.subscribe(x=> {
          this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA.filter(item=>{
            return item.email.toLowerCase().indexOf(x) > -1;
          }))})
    }
    
  }
  

