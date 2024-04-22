import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthRequest } from 'src/app/component/request/auth-request';
import { EditUserRequest } from 'src/app/component/request/edit-user-request';
import { UserRequest } from 'src/app/component/request/user-request';
import { TokenPayload } from 'src/app/model/app.model';
import { SongPlayerService } from '../song-player/song-player.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:8080/auth';

  constructor(
    private http: HttpClient,
    private songPlayerService: SongPlayerService
  ) {}

  login(authRequest: AuthRequest) {
    return this.http.post<any>(`${this.url}/login`, authRequest);
  }

  register(userRequest: UserRequest) {
    return this.http.post<any>(`${this.url}/register`, userRequest);
  }

  logout() {
    localStorage.removeItem('token');
    this.songPlayerService.resetAll();
  }

  editUser(user_id: number, editRequest: EditUserRequest) {
    return this.http.put(`${this.url}/editUser/${user_id}`, editRequest);
  }

  isTokenValid() {
    try {
      return !!jwtDecode(localStorage.getItem('token') ?? '');
    } catch (error) {
      return false;
    }
  }

  getToken(): String {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found.');
    }
    return token;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getTokenPayload(): TokenPayload {
    if (!this.isTokenValid()) {
      throw new Error("Token doesn't exist or is not valid.");
    }

    return jwtDecode(localStorage.getItem('token')!);
  }
}
