import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignInComponent } from "./signIn/signIn.component";
import { RegisterComponent } from "./register/register.component";
import { BooksComponent } from "./books/books.component";
import { AdminComponent } from "./admin/admin.component";
import { AuthGuard } from "./auth.guard";
import { CartComponent } from "./cart/cart.component";
import { NewBookComponent } from "./new-book/new-book.component";
import { ProfileComponent } from "./profile/profile.component";
import { ShopGuardsService } from "./guards/shop-guards.service";
export const routes: Routes = [
  { path: "signIn", component: SignInComponent },
  { path: "register", component: RegisterComponent },

  {
    path: "books",
    component: BooksComponent,
    canActivate: [ShopGuardsService],
    runGuardsAndResolvers: "always"
  },
  {
    path: "",
    loadChildren: () =>
      import("./admin/admin.module").then(mod => mod.AdminModule)
  },
  //   component: AdminComponent,
  //   canActivate: [AuthGuard],
  //   runGuardsAndResolvers: "always"
  // },
  {
    path: "cart",
    component: CartComponent,
    canActivate: [ShopGuardsService],
    runGuardsAndResolvers: "always"
  },
  {
    path: "bookInfo/:id",
    component: NewBookComponent,
    canActivate: [ShopGuardsService],
    runGuardsAndResolvers: "always"
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [ShopGuardsService],
    runGuardsAndResolvers: "always"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
