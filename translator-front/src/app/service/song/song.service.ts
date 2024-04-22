import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album, Artist, Lyrics, Song } from 'src/app/model/app.model';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private url = 'http://localhost:8080/song';

  constructor(private http: HttpClient) {}

  getSongName() {
    return this.http.get<any>(`${this.url}/findByName`);
  }

  getSongsByAlbumId(artistId: number) {
    return this.http.get<{
      message: string;
      data: Song[];
    }>(`${this.url}/findByAlbumId`, {
      params: {
        album_id: artistId.toString(),
      },
    });
  }
  getSongsByArtistId(artistId: number) {
    return this.http.get<{
      message: string;
      data: Song[];
    }>(`${this.url}/findSongsByArtistId`, {
      params: {
        artist_id: artistId.toString(),
      },
    });
  }

  getSongId() {
    return this.http.get<any>(`${this.url}/findById`);
  }

  getAllSong() {
    return this.http.get<{
      message: string;
      data: Song[];
    }>(`${this.url}/findAll`);
  }

  createSong(
    file: File,
    al_id: number,
    ar_id: number,
    ly_id: number,
    picFile: File
  ) {
    const formData = new FormData();
    formData.append('song_file', file);
    formData.append('album_id', al_id.toString());
    formData.append('artist_id', ar_id.toString());
    formData.append('lyrics_id', ly_id.toString());
    formData.append('pic_file', picFile);
    return this.http.post<any>(`${this.url}/addSong`, formData);
  }

  deleteSong(song_id: number) {
    return this.http.delete<any>(`${this.url}/deleteSong/${song_id}`);
  }

  search(input: string) {
    return this.http.get<{
      message: string;
      data: SongSearchResults;
    }>(`${this.url}/search/${input}`);
  }
}

export type SongSearchResults = {
  albums: Album[];
  artists: Artist[];
  songs: Song[];
  lyrics: Lyrics[];
};
