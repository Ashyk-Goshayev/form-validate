import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
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
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule
} from "@angular/material";

import { BooksComponent } from "./books/books.component";
import { AdminComponent } from "./admin/admin.component";
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

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    RegisterComponent,
    BooksComponent,
    AdminComponent,
    CartComponent,
    CartAsideComponent,
    CartIconComponent,
    NewBookComponent,
    SearchComponent,
    UserComponent,
    ProfileComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    HttpClientModule,
    ReactiveFormsModule,
    StorageServiceModule,
    MatGridListModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" }),
    MatButtonModule,
    MatCheckboxModule,
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
    ShopGuardsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
