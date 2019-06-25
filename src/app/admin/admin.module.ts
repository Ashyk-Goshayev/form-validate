import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { ListOfBooksComponent } from "../list-of-books/list-of-books.component";
import { PopForBooksComponent } from "../pop-for-books/pop-for-books.component";
import { MaterialModule } from "../materials";
@NgModule({
  declarations: [AdminComponent, ListOfBooksComponent, PopForBooksComponent],
  imports: [AdminRoutingModule, CommonModule, MaterialModule]
})
class AdminModule {}
export { AdminModule };
