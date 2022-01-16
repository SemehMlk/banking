import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    private snackbar: MatSnackBar,
    public router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.currentUserValue;
    if (this.authService.isLoggedIn !== true) {
      this.snackbar.open('s\'il vous plait Connectez-vous pour y acceder', '😎', {
        duration: 10000
      });
      this.router.navigate(['login'])
    }
    else {
      if (route.data.roles && currentUser.roles && currentUser.roles.length > 0 && route.data.roles.indexOf(currentUser.roles[0].name) === -1) {
        this.router.navigate(['/'])
      }
    }
    return true;
  }
}