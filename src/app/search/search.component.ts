import { Component, OnInit, NgZone, ChangeDetectorRef, ApplicationRef, 
  ViewChild, ElementRef, AfterViewInit, Input  } from '@angular/core';
import { BookServiceService } from '../book-service.service';
import { switchMap, debounceTime, tap, map,throttleTime} from 'rxjs/operators';
import { Book } from '../book-service.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import {Observable, fromEvent, Subscription, }  from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  constructor(private service : BookServiceService) {}
  @ViewChild('input', null) Input: ElementRef;

  ngOnInit() {
    fromEvent(this.Input.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      })
      ,debounceTime(500)
    ).subscribe((text: string) => {
      this.service.sendTextToFilter(text)
    })
  }

}

