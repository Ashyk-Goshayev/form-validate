import { Injectable, Injector, ErrorHandler } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalStorageService } from "./main.service";
import { error } from "@angular/compiler/src/util";
import { TokenService } from "./token.service";
@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private _toastr: ToastrService, private _injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
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
  protected get authService() {
    return this._injector.get(TokenService);
  }
}
