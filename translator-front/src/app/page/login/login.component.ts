import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthRequest } from 'src/app/component/request/auth-request';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  request: AuthRequest = {};
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  loginFailed: boolean = false;

  login() {
    this.userService.login(this.request).subscribe(
      (data) => {
        this.userService.setToken(data.data as string);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login failed', error);
        this.loginFailed = true;
      }
    );
  }
}
