import { Injectable, Injector, ErrorHandler } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalStorageService } from "./main.service";
@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private service: LocalStorageService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokenizedReq = req.clone({
      setHeaders: {
        Autorization: `Bearer Ashyk`
      }
    });
    return next.handle(tokenizedReq);
  }

  // handleError(error: any) {
  //   const router = this.injector.get(Router);
  //   console.log(router.url);
  //   if (error instanceof HttpErrorResponse) {
  //     console.log(error.status);
  //     console.log(error.message);
  //   } else {
  //     console.log(error.message);
  //   }
  // }
}
