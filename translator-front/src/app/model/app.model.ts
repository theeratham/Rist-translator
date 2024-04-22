export interface UserInfo {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: 'ROLE_ADMIN' | 'ROLE_USER';
}

export interface Playlist {
  id: number;
  name: string;
  user: UserInfo;
  songs: Song[];
}

export interface Song {
  id: number;
  name: string;
  filePath: string;
  picturePath: string;
  duration: number;
  album: Album;
  artist: Artist;
}

export interface Album {
  id: number;
  name: string;
  released_year: string;
  picturePath: string;
}

export interface Artist {
  id: number;
  name: string;
  description: string;
  picturePath: string;
}

export interface Lyrics {
  id: number;
  filePath: string;
  name: string;
  lyric: string;
  song: Song;
}

export interface TokenPayload {
  email: string;
  exp: number;
  firstname: string;
  iat: number;
  id: number;
  lastname: string;
  roles: 'ROLE_ADMIN' | 'ROLE_USER';
  username: string;
}

export interface SyncedLyrics {
  lyric_lines: {
    startTimeMs: number;
    words: string;
  }[];
}

export interface SyncedLyricsPair {
  original: SyncedLyrics;
  translated: SyncedLyrics;
}
