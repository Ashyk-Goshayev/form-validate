import { Injectable, Injector, ErrorHandler } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalStorageService } from "./main.service";
import { error } from "@angular/compiler/src/util";
@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private _toastr: ToastrService, private _injector: Injector) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // let auth = this._injector.get(LocalStorageService);
    // let token = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${auth.getToken()}`
    //   }
    // });
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "";
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        this._toastr.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
}
