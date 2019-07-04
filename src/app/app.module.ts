import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector, ErrorHandler } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SignInComponent } from "./signIn/signIn.component";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { ReactiveFormsModule } from "@angular/forms";
import { LocalStorageService } from "./main.service";
import { StorageServiceModule } from "angular-webstorage-service";
import { RegisterComponent } from "./register/register.component";
import { BookServiceService } from "./book-service.service";
import { BooksComponent } from "./books/books.component";
import { AuthGuard } from "./auth.guard";
import { CartComponent } from "./cart/cart.component";
import { HttpClientModule } from "@angular/common/http";
import { CartAsideComponent } from "./cart-aside/cart-aside.component";
import { CartIconComponent } from "./cart-icon/cart-icon.component";
import { NewBookComponent } from "./new-book/new-book.component";
import { SearchComponent } from "./search/search.component";
import { UserComponent } from "./user/user.component";
import { ProfileComponent } from "./profile/profile.component";
import { ShopGuardsService } from "./guards/shop-guards.service";
import { CommonModule } from "@angular/common";
import { ListOfBooksComponent } from "./list-of-books/list-of-books.component";
import { PopForBooksComponent } from "./pop-for-books/pop-for-books.component";
// import { AdminRoutingModule } from "./admin/admin-routing.module";
import { AdminComponent } from "./admin/admin.component";
// import { AdminModule } from "./admin/admin.module";
import { MaterialModule } from "./materials";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "./interceptor.service";
import { NgxImageCompressService } from "ngx-image-compress";
@NgModule({
  declarations: [
    AppComponent,
    PopForBooksComponent,
    ListOfBooksComponent,
    AdminComponent,
    HomeComponent,
    SignInComponent,
    RegisterComponent,
    BooksComponent,
    CartComponent,
    CartAsideComponent,
    CartIconComponent,
    NewBookComponent,
    SearchComponent,
    UserComponent,
    ProfileComponent
  ],
  imports: [
    MaterialModule,
    // AdminModule,
    FormsModule,
    // BrowserModule,
    AppRoutingModule,

    HttpClientModule,
    ReactiveFormsModule,
    StorageServiceModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: "toast-top-center",
      preventDuplicates: true
    })
  ],
  providers: [
    LocalStorageService,
    AuthGuard,
    BookServiceService,
    ShopGuardsService,
    NgxImageCompressService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
