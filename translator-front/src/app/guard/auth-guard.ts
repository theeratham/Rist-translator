import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';
import { UserService } from '../service/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userService.isTokenValid()) {
      const path = this.location.path();
      if (path === '/login' || path === '/register') {
        return this.router.navigate(['/home']);
      }
      return true;
    }
    return this.router.navigate(['/login']);
  }
}
