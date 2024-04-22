package com.example.translator.controller;

import com.example.translator.entity.Album;
import com.example.translator.entity.request.AlbumRequest;
import com.example.translator.entity.response.DataResponse;
import com.example.translator.repository.AlbumRepository;
import com.example.translator.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/album")
public class AlbumController {
    @Autowired
    private AlbumService albumService;
    @Autowired
    private AlbumRepository albumRepository;
    @Autowired
    private UserDetailsService userDetailsService;

    @GetMapping("/findById")
    public ResponseEntity<DataResponse> findById(@RequestParam Long album_id){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Album Found");
            response.setData(albumService.findAlbumById(album_id));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findByArtistId")
    public ResponseEntity<DataResponse> findByArtistId(@RequestParam Long artist_id){
        DataResponse response = new DataResponse();
        response.setData(albumService.findAlbumsByArtistId(artist_id));
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/findByArtistName")
    public ResponseEntity<DataResponse> findByArtistName(@RequestParam String artist_name){
        DataResponse response = new DataResponse();
        response.setData(albumService.findAlbumsByArtistName(artist_name));
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/findByName")
    public ResponseEntity<DataResponse> findByName(@RequestParam String album_name){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Album Found");
            response.setData(albumService.findAlbumByName(album_name));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findAll")
    public ResponseEntity<DataResponse> findAll(){
        DataResponse response = new DataResponse();
        List<Album> albums = albumService.findAllAlbum();
        if (!albums.isEmpty()){
            response.setMessage("Album Found");
            response.setData(albums);
            return ResponseEntity.ok().body(response);
        }
        response.setMessage("Nothing Found");
        return ResponseEntity.badRequest().body(response);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PostMapping("/addAlbum")
    public ResponseEntity<DataResponse> addAlbum(@ModelAttribute AlbumRequest request) {
        DataResponse response = new DataResponse();
        if (!albumService.isInputNull(request)){
            if (albumRepository.existsByName(request.getAlbum_name())){
                response.setMessage("Album Name Already Existed");
                return ResponseEntity.badRequest().body(response);
            } else {
                try {
                    response.setMessage("Album Added Successfully!!");
                    response.setData(albumService.addAlbum(request));
                    return ResponseEntity.ok().body(response);
                } catch (Exception e){
                    response.setMessage(e.getMessage());
                    return ResponseEntity.badRequest().body(response);
                }
            }
        }
        response.setMessage("Input Field Cannot Be Empty");
        return ResponseEntity.badRequest().body(response);
    }
}
