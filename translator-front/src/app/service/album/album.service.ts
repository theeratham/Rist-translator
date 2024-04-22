import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album } from 'src/app/model/app.model';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private url = 'http://localhost:8080/album';

  constructor(private http: HttpClient) {}

  getAlbumName() {
    return this.http.get<any>(`${this.url}/findByName`);
  }

  getAlbumId(id: number) {
    return this.http.get<{
      message: string;
      data: Album;
    }>(`${this.url}/findById`, {
      params: {
        album_id: id.toString(),
      },
    });
  }

  getAllAlbum() {
    return this.http.get<{
      messgae: string;
      data: Album[];
    }>(`${this.url}/findAll`);
  }

  createAlbum(name: string, year: string, pic_file: File) {
    const formData = new FormData();
    formData.append('album_name', name);
    formData.append('album_year', year);
    formData.append('pic_file', pic_file);
    return this.http.post<any>(`${this.url}/addAlbum`, formData);
  }

  getAlbumByArtist(artist_id: number) {
    return this.http.get<{
      message: string;
      data: Album[];
    }>(`${this.url}/findByArtistId`, {
      params: {
        artist_id: artist_id,
      },
    });
  }
}
