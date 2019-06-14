import { Component, OnInit } from '@angular/core';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { LocalStorageService } from '../local-storage.service';
import { Router, NavigationEnd} from '@angular/router'
import { Location } from '@angular/common'
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface PeriodicElement {
  email: string;
  position: number;
  password: string;
  delete: string;
  edit: string;
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

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}` ;
  }
  addBook(){
    fetch(`http://localhost:3000/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(this.exampleForm.value)
    })
  }
  file : File = null
  getURL(img){
    const fd = new FormData()
    
    var reader = new FileReader()
    reader.onloadend = ()=>{
      this.exampleForm.value.image = reader.result;
    };
    this.file = <File>img.files[0]
    // fd.append('image', this.file, this.file.name)
    if(this.file){
      reader.readAsDataURL(this.file)
    }else{
      img.value = "";
    }
  }
  index : number =  0
  async deleteRow(user){
    user = this.deleteUser
    let response  = await fetch(`http://localhost:3000/users/${user.position}`, {
              method: 'DELETE'
    });
    
    if(response.ok){
      console.log(this.dataSource.filteredData)
      console.log(user)
      for (let current of this.dataSource.filteredData) {
        current.position == user.position ? ELEMENT_DATA.splice(this.index, 1) : null
        this.index++
      }
      this.dataSource.data = ELEMENT_DATA;
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
    fetch(`http://localhost:3000/users/${this.position}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({email: em, password: pass})
    })
    this.fillLp({email: em, password: pass , id: this.position});
  }
  async openSnackBar(email : string, password : string){ 
      let result = await fetch('http://localhost:3000/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({email: email, password: password})
            })
      if(result.ok){
        await this.fillList({email: email, password: password})
        await this.togglePop()
      }
     
  }
  constructor(private localStore : LocalStorageService, private formBuilder: FormBuilder, private router : Router, private location: Location) {
    this.createForm();
  }
  openDialog(row) {
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
      price: new FormControl,
      image: new FormControl
    });
  }
  
  async fillList(user){

    ELEMENT_DATA.push({email : user.email, delete: "delete", edit: "edit",password : user.password, position: ELEMENT_DATA.length + 1  });  
    this.dataSource.data = ELEMENT_DATA;
  }
  fillLp(user){
    let oldUser = ELEMENT_DATA.filter( (x) => {  return x.position === user.id } )[0];
    if(oldUser){
      oldUser.email = user.email
    }
    
   
    this.dataSource.data = ELEMENT_DATA;
  }
  
  ngOnInit() {
    this.localStore.getData()
    for (let i = 0; i < this.localStore.user_2.length; i++) {
      ELEMENT_DATA.push({email : this.localStore.user_2[i].email, delete: "delete", edit: "edit",password : this.localStore.user_2[i].password, position: this.localStore.user_2[i].id  });    
    }
    this.dataSource.data = ELEMENT_DATA;
   
  }
}
