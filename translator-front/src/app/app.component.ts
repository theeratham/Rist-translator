import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showNavBar: boolean = true;
  hidePlayer: boolean = false;
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.showNavBar = val.url !== '/login' && val.url !== '/register';
        this.hidePlayer = val.url === '/policy';
      }
    });
  }
  ngOnInit(): void {}
}
