package com.example.translator.controller;

import com.example.translator.entity.Song;
import com.example.translator.entity.request.SongRequest;
import com.example.translator.entity.response.DataResponse;
import com.example.translator.repository.SongRepository;
import com.example.translator.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/song")
public class SongController {
    @Autowired
    private SongService songService;

    @Autowired
    private SongRepository songRepository;

    @GetMapping("/findAll")
    public ResponseEntity<DataResponse> findAll(){
        DataResponse response = new DataResponse();
        List<Song> songList = songService.findAllSong();
        if (!songList.isEmpty()){
            response.setMessage("Song Found");
            response.setData(songList);
            return ResponseEntity.ok().body(response);
        }
        response.setMessage("Nothing Found");
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/findId")
    public ResponseEntity<DataResponse> findById(@RequestParam Long song_id){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Song Found");
            response.setData(songService.findSongById(song_id));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findByName")
    public ResponseEntity<DataResponse> findByName(@RequestParam String song_name){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Song Found");
            response.setData(songService.findSongByName(song_name));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findSongsByArtistId")
    public ResponseEntity<DataResponse> findSongsByArtistId(@RequestParam Long artist_id){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Album Found");
            response.setData(songService.findSongsByArtistId(artist_id));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage("Nothing Found");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findByAlbumId")
    public ResponseEntity<DataResponse> findByAlbumId(@RequestParam Long album_id){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Album Found");
            response.setData(songService.findSongByAlbumId(album_id));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage("Nothing Found");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findByAlbumName")
    public ResponseEntity<DataResponse> findByAlbumName(@RequestParam String album_name){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Album Found");
            response.setData(songService.findSongByAlbumName(album_name));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage("Nothing Found");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/search/{input}")
    public ResponseEntity<DataResponse> search(@PathVariable String input){
        DataResponse response = new DataResponse();
        HashMap<String, Object> result = songService.search(input);
        if (!result.isEmpty()){
            response.setMessage("Items Found");
            response.setData(result);
            return ResponseEntity.ok().body(response);
        } else {
            response.setMessage("Nothing Found");
            return ResponseEntity.badRequest().body(response);
        }
    }

//    @GetMapping("/duration")
//    public ResponseEntity<DataResponse> getDuration(@RequestParam MultipartFile file){
//        DataResponse response = new DataResponse();
//        try {
//            response.setMessage("good");
//            response.setData(songService.getDuration(file));
//            return ResponseEntity.ok().body(response);
//        } catch (Exception e){
//            response.setMessage(e.getMessage());
//            return ResponseEntity.badRequest().body(response);
//        }
//    }


    @PostMapping("/addSong")
    public ResponseEntity<DataResponse> addSong(@ModelAttribute SongRequest request){
        DataResponse response = new DataResponse();
        if (songRepository.existsByName(request.getSong_file().getOriginalFilename())){
            response.setMessage("Song Name Already Existed");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            response.setData(songService.addSongS3(request));
            response.setMessage("Song Added Successfully!!");
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/deleteSong")
    public ResponseEntity<DataResponse> deleteSong(@RequestParam Long song_id){
        DataResponse response = new DataResponse();
        if (song_id != null){
            songService.deleteSong(song_id);
            response.setMessage("Song Has Been Deleted");
            return ResponseEntity.ok().body(response);
        } else {
            response.setMessage("Song Not Found");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
