package com.example.translator.controller;

import com.example.translator.entity.Artist;
import com.example.translator.entity.request.ArtistRequest;
import com.example.translator.entity.response.DataResponse;
import com.example.translator.repository.ArtistRepository;
import com.example.translator.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artist")
public class ArtistController {
    @Autowired
    private ArtistService artistService;
    @Autowired
    private ArtistRepository artistRepository;

    @GetMapping("/findById")
    public ResponseEntity<DataResponse> findById(@RequestParam Long artist_id){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Artist Found");
            response.setData(artistService.findArtistById(artist_id));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findByName")
    public ResponseEntity<DataResponse> findByName(@RequestParam String artist_name){
        DataResponse response = new DataResponse();
        try {
            response.setMessage("Artist Found");
            response.setData(artistService.findArtistByName(artist_name));
            return ResponseEntity.ok().body(response);
        } catch (Exception e){
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/findAll")
    public ResponseEntity<DataResponse> findAll(){
        DataResponse response = new DataResponse();
        List<Artist> artists = artistService.findAllArtist();
        if (!artists.isEmpty()){
            response.setMessage("Artist Found");
            response.setData(artists);
            return ResponseEntity.ok().body(response);
        }
        response.setMessage("Nothing Found");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/addArtist")
    public ResponseEntity<DataResponse> addArtist(@ModelAttribute ArtistRequest request){
        System.out.println(1);
        DataResponse response = new DataResponse();
        System.out.println(2);
        if (!artistService.isInputNull(request)){
            System.out.println(3);
            if (artistRepository.existsByName(request.getArtist_name())){
                System.out.println(4);
                response.setMessage("Artist Name Already Existed");
                return ResponseEntity.badRequest().body(response);
            } else {
                System.out.println(5);
                try {
                    response.setMessage("Artist Added Successfully!!");
                    response.setData(artistService.addArtist(request));
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
