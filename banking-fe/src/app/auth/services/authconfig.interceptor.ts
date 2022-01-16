import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        // req = req.clone({
        //     setParams: {
        //         api_token: authToken
        //     }
        // });
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + authToken
            }
        });

        return next.handle(req).pipe(
            catchError(er => {
                if (er.status === 401) {
                    this.authService.logout();
                }
                return throwError(er);
            })
        );
    }
}