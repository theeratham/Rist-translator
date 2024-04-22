import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  guestNavItems: NavBarItem[] = [
    {
      icon: 'bi-house-door',
      title: 'Home',
      routerLink: '/login',
    },
  ];
  userNavItems: NavBarItem[] = [
    {
      icon: 'bi-house-door',
      title: 'Home',
      routerLink: '/home',
    },
    {
      icon: 'bi-music-note-list',
      title: 'My Playlist',
      routerLink: '/playlist',
    },
  ];
  adminNavItems: NavBarItem[] = [
    {
      icon: 'bi-house-door',
      title: 'Home',
      routerLink: '/home',
    },
    {
      icon: 'bi-music-note-list',
      title: 'My Playlist',
      routerLink: '/playlist',
    },
    {
      icon: 'bi-vinyl-fill',
      title: 'Songs',
      routerLink: '/song',
    },
  ];

  navItems: NavBarItem[] = [];

  constructor(userService: UserService, private router: Router) {
    const navMap = {
      ROLE_USER: this.userNavItems,
      ROLE_ADMIN: this.adminNavItems,
      ROLE_GUEST: this.guestNavItems,
    };
    this.navItems = navMap[userService.getTokenPayload().roles];
  }

  ngOnInit(): void {}
}

type NavBarItem = {
  icon: string;
  title: string;
  routerLink: string;
};
