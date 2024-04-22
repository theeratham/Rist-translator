import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Playlist } from 'src/app/model/app.model';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private url = 'http://localhost:8080/playlist';

  constructor(private http: HttpClient) {}

  getMyPlaylist() {
    return this.http.get<{
      message: string;
      data: Playlist[];
    }>(`${this.url}/findMy`);
  }

  getPlaylistByName(name: string) {
    return this.http.get<{
      message: string;
      data: Playlist;
    }>(`${this.url}/findByName`);
  }

  getPlaylistById(id: number) {
    return this.http.get<{
      message: string;
      data: Playlist;
    }>(`${this.url}/findById`, {
      params: {
        playlist_id: id.toString(),
      },
    });
  }

  getAllPlaylist() {
    return this.http.get<any[]>(`${this.url}/findAll`);
  }

  getAllPlaylistByUserId(userId: number) {
    return this.http.get<{
      message: string;
      data: Playlist[];
    }>(`${this.url}/findByUserId`, {
      params: {
        user_id: userId.toString(),
      },
    });
  }

  createPlaylist(name: string) {
    return this.http.post<any>(`${this.url}/addPlaylist`, {
      playlist_name: name,
    });
  }

  editPlaylist(name: string) {
    return this.http.put<string>(`${this.url}/editPlaylist`, name);
  }

  deletePlaylist(playlist_id: number) {
    return this.http.delete<number>(
      `${this.url}/deletePlaylist/${playlist_id}`
    );
  }

  removeSongFromplaylist(song_id: number, playlist_id: number) {
    return this.http.post<any>(`${this.url}/removeSongFromPlaylist`, {
      song_id,
      playlist_id,
    });
  }

  addSongToPlaylist(song_id: number, playlist_id: number) {
    return this.http.post<any>(`${this.url}/addSongToPlaylist`, {
      song_id,
      playlist_id,
    });
  }
}
