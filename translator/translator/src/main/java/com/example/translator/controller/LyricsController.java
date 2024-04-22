package com.example.translator.controller;

import com.example.translator.entity.Lyrics;
import com.example.translator.entity.external.SpotifyLyricLines;
import com.example.translator.entity.request.LyricsRequest;
import com.example.translator.entity.response.DataResponse;
import com.example.translator.repository.LyricsRepository;
import com.example.translator.service.LyricsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.api.client.json.JsonString;
import com.google.common.reflect.TypeToken;
import com.google.gson.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/lyrics")
public class LyricsController {
    @Autowired
    private LyricsService lyricsService;
    @Autowired
    private LyricsRepository lyricsRepository;

    @GetMapping("/findById")
    public ResponseEntity<DataResponse> findById(@RequestParam Long lyrics_id){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Lyrics Found");
            response.setData(lyricsService.findLyricsById(lyrics_id));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }


    @GetMapping("/getSpotifySyncedLyrics")
    public ResponseEntity<DataResponse> getSpotifySyncedLyrics(@RequestParam String track_id){
        DataResponse response = new DataResponse();
        Gson gson = new Gson();
        try {
            HashMap<String, List<SpotifyLyricLines>> lyrics = lyricsService.getSpotifyLyrics(track_id);
            response.setMessage("Successful");
            response.setData(lyrics);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }




    @GetMapping("/generateLyricsFromSpotifyTrackId")
    public ResponseEntity<DataResponse> generateLyricsFromSpotifyTrackId(@RequestParam String track_id){
        DataResponse response = new DataResponse();
        try {
            HashMap<String, List<SpotifyLyricLines>> lyrics = lyricsService.generateLyricsFromSpotifyTrackId(track_id);
            response.setMessage("success");
            response.setData(lyrics);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findAll")
    public ResponseEntity<DataResponse> findAll(){
        DataResponse response = new DataResponse();
        List<Lyrics> lyrics = lyricsService.findAllLyrics();
        if (!lyrics.isEmpty()){
            response.setMessage("Lyrics Found");
            response.setData(lyrics);
            return ResponseEntity.ok().body(response);
        }
        response.setMessage("Nothing Found");
        return ResponseEntity.badRequest().body(response);
    }


    @GetMapping("/findLyricsBySongId")
    public ResponseEntity<DataResponse> findLyricsBySongId(Long song_id){
        DataResponse response = new DataResponse();
        Lyrics lyrics = lyricsService.findLyricsBySongId(song_id);
        if (!(lyrics == null)){
            response.setMessage("Lyrics Found");
            response.setData(lyrics);
            return ResponseEntity.ok().body(response);
        }
        response.setMessage("Nothing Found");
        return ResponseEntity.badRequest().body(response);
    }


    @PostMapping("/addLyrics")
    public ResponseEntity<DataResponse> addLyrics(@ModelAttribute LyricsRequest request) throws JsonProcessingException {
        DataResponse response = new DataResponse();
        if (!lyricsService.isInputNull(request)){
            response.setMessage("Lyrics Added Successfully!!");
            response.setData(lyricsService.addLyrics(request));
            return ResponseEntity.ok().body(response);
        }
        response.setMessage("Field Is Empty");
        return ResponseEntity.badRequest().body(response);
    }
}
