package com.example.translator.service;

import com.example.translator.entity.Artist;
import com.example.translator.entity.request.ArtistRequest;
import com.example.translator.repository.ArtistRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ArtistService {
    @Autowired
    private ArtistRepository artistRepository;
    @Autowired
    private AwsS3FileService awsS3FileService;

    public boolean isInputNull(ArtistRequest request){
        return request.getArtist_name() == null || request.getArtist_name().isEmpty() ||
                request.getDescription() == null || request.getDescription().isEmpty();
    }

    public List<Artist> findAllArtist(){
        return artistRepository.findAll();
    }

    public Artist findArtistByName(String artist_name){
        return artistRepository.findByName(artist_name).orElseThrow(
                () -> new EntityNotFoundException("Artist Not Found"));
    }
    public Artist findArtistById(Long artist_id){
        return artistRepository.findById(artist_id).orElseThrow(() -> new EntityNotFoundException("Artist Not Found"));
    }

    public Artist addArtist(ArtistRequest request) throws Exception {
        if (!request.getPic_file().isEmpty()){
            String imageUrl = awsS3FileService.uploadToAmazon(request.getPic_file(), "artists/image");
            Artist artist = Artist.builder()
                    .name(request.getArtist_name())
                    .description(request.getDescription())
                    .picturePath(imageUrl)
                    .build();
            return artistRepository.save(artist);
        } else {
            throw new IOException("File IS Empty");
        }
    }
}
