package com.example.translator.service;

import com.example.translator.entity.Album;
import com.example.translator.entity.Artist;
import com.example.translator.entity.Lyrics;
import com.example.translator.entity.Song;
import com.example.translator.entity.request.SongRequest;
import com.example.translator.repository.AlbumRepository;
import com.example.translator.repository.ArtistRepository;
import com.example.translator.repository.LyricsRepository;
import com.example.translator.repository.SongRepository;
import com.example.translator.util.FileUtils;
import jakarta.persistence.EntityNotFoundException;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.tag.TagException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sound.sampled.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Service
public class SongService {
    @Autowired
    private SongRepository songRepository;
    @Autowired
    private AlbumRepository albumRepository;
    @Autowired
    private ArtistRepository artistRepository;
    @Autowired
    private LyricsRepository lyricsRepository;
    @Autowired
    private AwsS3FileService  awsS3FileService;

    public Song findSongById(Long song_id){
        return songRepository.findById(song_id).orElseThrow(
                () -> new RuntimeException("Song Not Found"));
    }

    public Song findSongByName(String song_name){
        return songRepository.findByName(song_name).orElseThrow(
                () -> new RuntimeException("Song Not Found"));
    }

    public List<Song> findSongsByArtistId(Long artist_id) {
        Artist artist = artistRepository.findById(artist_id).orElseThrow(() -> new EntityNotFoundException("Artist Not Found"));
        return new ArrayList<>(artist.getSongs());
    }

    public List<Song> findSongByAlbumId(Long album_id){
         Album album = albumRepository.findById(album_id).orElseThrow(() -> new EntityNotFoundException("Album Not Found"));
         return new ArrayList<>(album.getSongs());
    }


    public List<Song> findSongByAlbumName(String album_name){
        Album album = albumRepository.findByName(album_name).orElseThrow(() -> new EntityNotFoundException("Album Not Found"));
        return new ArrayList<>(album.getSongs());
    }

    public List<Song> findAllSong(){
        return songRepository.findAll();
    }

    public void deleteSong(Long song_id){
        songRepository.deleteById(song_id);
    }
    public Song addSongS3(SongRequest request) throws Exception {
        if (!request.getPic_file().isEmpty() && !request.getSong_file().isEmpty()) {
            String imageUrl = awsS3FileService.uploadToAmazon(request.getPic_file(), "songs/image");
            String songUrl = awsS3FileService.uploadToAmazon(request.getSong_file(), "songs/song");
            Album album = albumRepository.findById(request.getAlbum_id()).orElseThrow(() -> new EntityNotFoundException("Album Not Found"));
            Artist artist = artistRepository.findById(request.getArtist_id()).orElseThrow(() -> new EntityNotFoundException("Artist Not Found"));
            Lyrics lyrics = lyricsRepository.findById(request.getLyrics_id()).orElseThrow(() -> new EntityNotFoundException("Lyrics Not Found"));
            MultipartFile file = request.getSong_file();
            String fileName = file.getOriginalFilename();

            int lastDotIndex = Objects.requireNonNull(fileName).lastIndexOf(".");
            String fileNameWithoutExtension = (lastDotIndex == -1) ? fileName : fileName.substring(0, lastDotIndex);
            Song song = Song.builder()
                    .name(fileNameWithoutExtension)
                    .album(album)
                    .artist(artist)
                    .lyrics(lyrics)
                    .filePath(songUrl)
                    .picturePath(imageUrl)
                    .duration(getDuration(request.getSong_file()))
                    .build();
            return songRepository.save(song);
        } else {
            throw new IOException("File Is Empty");
        }

    }

//    public Song addSong(SongRequest request) throws IOException {
//        if (!request.getPic_file().isEmpty() && !request.getSong_file().isEmpty()){
//            String songPath = "\\Rist-Project\\translator\\translator\\src\\main\\resources\\audio\\" + request.getSong_file().getOriginalFilename();
//            String picPath = "\\Rist-Project\\translator\\translator\\src\\main\\resources\\picture\\" + request.getPic_file().getOriginalFilename();
//            Files.write(Paths.get(songPath),request.getSong_file().getBytes());
//            Files.write(Paths.get(picPath),request.getPic_file().getBytes());
//            Album album = albumRepository.findById(request.getAlbum_id()).orElseThrow(() -> new EntityNotFoundException("Album Not Found"));
//            Artist artist = artistRepository.findById(request.getArtist_id()).orElseThrow(() -> new EntityNotFoundException("Artist Not Found"));
//            Lyrics lyrics = lyricsRepository.findById(request.getLyrics_id()).orElseThrow(() -> new EntityNotFoundException("Lyrics Not Found"));
//            Song song = Song.builder()
//                    .name(request.getSong_file().getOriginalFilename())
//                    .album(album)
//                    .artist(artist)
//                    .lyrics(lyrics)
//                    .filePath(songPath)
//                    .picturePath(picPath)
//                    .build();
//            return songRepository.save(song);
//        } else {
//            throw new IOException("File Is Empty");
//        }
//    }

    public HashMap<String, Object> search(String input){
        HashMap<String, Object> result = new HashMap<>();
        System.out.println(1);
        List<Artist> artists = artistRepository.findByNameContaining(input);
        if (!artists.isEmpty()){
            result.put("artists", artists);
        } else {
            result.put("artists", new ArrayList<>());
        }
        System.out.println(2);
        List<Album> albums = albumRepository.findByNameContaining(input);
        if (!albums.isEmpty()){
            result.put("albums", albums);
        } else {
            result.put("albums", new ArrayList<>());
        }
        System.out.println(3);
        List<Song> songs = songRepository.findByNameContaining(input);
        if (!songs.isEmpty()){
            result.put("songs",songs);
        } else {
            result.put("songs", new ArrayList<>());
        }
        System.out.println(4);
        List<Lyrics> lyrics = lyricsRepository.findByLyricContaining(input);
        if (!lyrics.isEmpty()){
            result.put("lyrics",lyrics);
        } else {
            result.put("lyrics", new ArrayList<>());
        }
        System.out.println(5);
        return result;
    }

    public float getDuration(MultipartFile multipartFile) throws IOException {
        File audioFile = FileUtils.convertMultipartToFile(multipartFile);
        try {
            AudioFile audioFile1 = AudioFileIO.read(audioFile);
            return (float) audioFile1.getAudioHeader().getTrackLength();
        } catch (CannotReadException | TagException | InvalidAudioFrameException | ReadOnlyFileException e) {
            throw new RuntimeException(e);
        }

    }

}
