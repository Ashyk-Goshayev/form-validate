import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BookServiceService } from "../book-service.service";
import { debounceTime, map } from "rxjs/operators";
import { fromEvent } from "rxjs";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  constructor(private service: BookServiceService) {}
  @ViewChild("input", null) Input: ElementRef;

  ngOnInit() {
    fromEvent(this.Input.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(500)
      )
      .subscribe((text: string) => {
        this.service.sendTextToFilter(text);
      });
  }
}
