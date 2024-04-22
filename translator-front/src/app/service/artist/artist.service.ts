import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Artist } from 'src/app/model/app.model';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private url = 'http://localhost:8080/artist';

  constructor(private http: HttpClient) {}

  getArtistByName(artistName: string) {
    return this.http.get<any>(`${this.url}/findByName`, {
      params: {
        artist_name: artistName,
      },
    });
  }

  getArtistById(artistId: number) {
    return this.http.get<{
      message: string;
      data: Artist;
    }>(`${this.url}/findById`, {
      params: {
        artist_id: artistId,
      },
    });
  }

  getAllArtist() {
    return this.http.get<{
      message: string;
      data: Artist[];
    }>(`${this.url}/findAll`);
  }

  createArtist(name: string, description: string, file: File) {
    const formData = new FormData();
    formData.append('artist_name', name);
    formData.append('description', description);
    formData.append('pic_file', file);
    return this.http.post<any>(`${this.url}/addArtist`, formData);
  }
}
