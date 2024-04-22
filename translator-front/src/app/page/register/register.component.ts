import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRequest } from 'src/app/component/request/user-request';
import { Location } from '@angular/common';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  request: UserRequest = {};
  policies: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private location: Location
  ) {}

  register() {
    if(!this.policies){
      alert('Please accept the policies to continue')
      return;
    }
    this.userService.register(this.request).subscribe(
      (data) => {
        console.log('Registration successful', data);
        this.router.navigate(['/login']);
      },
      (error) => {
        alert('Registration failed');
        console.error('Registration failed', error);
      }
    );
  }

  back() {
    this.location.back();
  }
}
