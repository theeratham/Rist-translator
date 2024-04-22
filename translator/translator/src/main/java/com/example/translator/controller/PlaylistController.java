package com.example.translator.controller;

import com.example.translator.entity.Playlist;
import com.example.translator.entity.request.PlaylistAddRemoveRequest;
import com.example.translator.entity.request.PlaylistRequest;
import com.example.translator.entity.response.DataResponse;
import com.example.translator.repository.PlaylistRepository;
import com.example.translator.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/playlist")
public class PlaylistController {
    @Autowired
    private PlaylistService playlistService;
    @Autowired
    private PlaylistRepository playlistRepository;

    @GetMapping("/findById")
    public ResponseEntity<DataResponse> findById(@RequestParam Long playlist_id){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Playlist Found");
            response.setData(playlistService.findPlaylistById(playlist_id));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findByName")
    public ResponseEntity<DataResponse> findByName(@RequestParam String playlist_name){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Playlist Found");
            response.setData(playlistService.findPlaylistByName(playlist_name));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }


    @GetMapping("/findByUserId")
    public ResponseEntity<DataResponse> findByUserId(@RequestParam Long user_id){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Playlist Found");
            response.setData(playlistService.findPlaylistByUserId(user_id));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findMy")
    public ResponseEntity<DataResponse> findMy(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Playlist Found");
            response.setData(playlistService.findPlaylistByUsername(username));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findByUsername")
    public ResponseEntity<DataResponse> findByUsername(@RequestParam String username){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Playlist Found");
            response.setData(playlistService.findPlaylistByUsername(username));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findAll")
    public ResponseEntity<DataResponse> findAll(){
        DataResponse response = new DataResponse();
        List<Playlist> playlists = playlistService.findAllPlaylist();
        if (!playlists.isEmpty()){
            response.setMessage("Playlist Found");
            response.setData(playlists);
            return ResponseEntity.ok().body(response);
        }
        response.setMessage("Nothing Found");
        return ResponseEntity.badRequest().body(response);
    }
    @PostMapping("/addPlaylist")
    public ResponseEntity<DataResponse> addPlaylist(@RequestBody PlaylistRequest request){
        DataResponse response = new DataResponse();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!playlistService.isInputNull(request)){
            if (playlistRepository.existsByName(request.getPlaylist_name())){
                response.setMessage("Playlist Name Already Existed");
                return ResponseEntity.badRequest().body(response);
            } else {
                try {
                    response.setMessage("Playlist Added Successfully!!");
                    response.setData(playlistService.addPlaylist(request.getPlaylist_name(), username));
                    return ResponseEntity.ok().body(response);
                } catch (Exception e) {
                    response.setMessage(e.getMessage());
                    return ResponseEntity.badRequest().body(response);
                }
            }
        }
        response.setMessage("Field Is Empty");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/removeSongFromPlaylist")
    public ResponseEntity<DataResponse> removeSongFromPlaylist(@RequestBody PlaylistAddRemoveRequest request){
        DataResponse response = new DataResponse();
        try {
            playlistService.removeSongFromPlaylist(request.getPlaylist_id(), request.getSong_id());
            response.setMessage("Song removed from the playlist successfully.");
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    @PostMapping("/addSongToPlaylist")
    public ResponseEntity<DataResponse> addSongToPlaylist(@RequestBody PlaylistAddRemoveRequest request){
        DataResponse response = new DataResponse();
        try {
            playlistService.addSongToPlaylist(request.getPlaylist_id(), request.getSong_id());
            response.setMessage("Song Has Been Added To Playlist");
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/editPlaylist")
    public ResponseEntity<DataResponse> editPlaylist(@RequestParam Long playlist_id,@RequestParam String playlist_name){
        DataResponse response = new DataResponse();
        if (playlist_name != null) {
            try {
                playlistService.editPlaylist(playlist_id, playlist_name);
                response.setMessage("Playlist Edited");
                return ResponseEntity.ok().body(response);
            } catch (Exception e) {
                response.setMessage(e.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            response.setMessage("Input Field Cannot Be Empty");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/deletePlaylist/{playlist_id}")
    public ResponseEntity<DataResponse> deletePlaylist(@PathVariable Long playlist_id){
        DataResponse response = new DataResponse();
        if (playlist_id != null){
            playlistService.deletePlaylist(playlist_id);
            response.setMessage("Playlist Has Been Deleted");
            return ResponseEntity.ok().body(response);
        } else {
            response.setMessage("Playlist Not Found");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
