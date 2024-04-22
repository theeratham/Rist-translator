import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Lyrics,
  SyncedLyrics,
  SyncedLyricsPair,
} from 'src/app/model/app.model';

@Injectable({
  providedIn: 'root',
})
export class LyricsService {
  private url = 'http://localhost:8080/lyrics';

  constructor(private http: HttpClient) {}

  getLyricsBySongId(song_id: number) {
    return this.http.get<{
      message: string;
      data: Lyrics;
    }>(`${this.url}/findLyricsBySongId`, {
      params: {
        song_id: song_id,
      },
    });
  }

  getLyricsName() {
    return this.http.get<any>(`${this.url}/findByName`);
  }

  getLyricsId() {
    return this.http.get<any>(`${this.url}/findById`);
  }

  getAllLyrics() {
    return this.http.get<{
      message: string;
      data: Lyrics[];
    }>(`${this.url}/findAll`);
  }

  getAiLyrics(trackId: string) {
    return this.http.get<{
      message: string;
      data: SyncedLyrics;
    }>(`${this.url}/generateLyricsFromSpotifyTrackId`, {
      params: {
        track_id: trackId,
      },
    });
  }

  getSpotifySyncedLyrics(trackId: string) {
    return this.http.get<{
      message: string;
      data: SyncedLyrics;
    }>(`${this.url}/getSpotifySyncedLyrics`, {
      params: {
        track_id: trackId,
      },
    });
  }

  createLyrics(lyrics: SyncedLyricsPair, name: string) {
    const formData = new FormData();
    formData.append('song_name', name);
    formData.append('lyric', JSON.stringify(lyrics));
    return this.http.post<any>(`${this.url}/addLyrics`, formData);
  }
}
