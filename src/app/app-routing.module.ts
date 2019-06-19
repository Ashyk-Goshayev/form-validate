import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './signIn/signIn.component';
import { RegisterComponent } from './register/register.component';
import { BooksComponent } from './books/books.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { CartComponent } from './cart/cart.component';
import { NewBookComponent } from './new-book/new-book.component';

const routes: Routes = [
  {path: 'signIn', component: SignInComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'books', component: BooksComponent},
  {path: 'admin', component: AdminComponent,
  canActivate: [AuthGuard],
  runGuardsAndResolvers: 'always'
},
  {path: 'cart', component: CartComponent},
  {path: 'bookInfo/:id', component: NewBookComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
