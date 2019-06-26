import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { ListOfBooksComponent } from "../list-of-books/list-of-books.component";
import { PopForBooksComponent } from "../pop-for-books/pop-for-books.component";
import { MaterialModule } from "../materials";
import { FormsModule } from "@angular/forms";
import { CartIconComponent } from "../cart-icon/cart-icon.component";
import { SearchComponent } from "../search/search.component";
import { UserComponent } from "../user/user.component";
import { HomeComponent } from "../home/home.component";

@NgModule({
  declarations: [AdminComponent, ListOfBooksComponent, PopForBooksComponent],
  imports: [AdminRoutingModule, CommonModule, MaterialModule, FormsModule]
})
export class AdminModule {}
