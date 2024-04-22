package com.example.translator.service;

import com.example.translator.entity.Album;
import com.example.translator.entity.Song;
import com.example.translator.entity.request.AlbumRequest;
import com.example.translator.repository.AlbumRepository;
import com.example.translator.repository.SongRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AlbumService {
    @Autowired
    private SongRepository songRepository;
    @Autowired
    private AlbumRepository albumRepository;
    @Autowired
    private AwsS3FileService awsS3FileService;

    public boolean isInputNull(AlbumRequest request) {
        return request.getAlbum_name() == null || request.getAlbum_name().isEmpty() ||
                request.getAlbum_year() == null || request.getAlbum_year().isEmpty();
    }

    public List<Album> findAllAlbum(){
        return albumRepository.findAll();
    }

    public Album findAlbumByName(String album_name){
        return albumRepository.findByName(album_name).orElseThrow(
                () -> new EntityNotFoundException("Album Not Found"));
    }

    public Album findAlbumById(Long album_id){
        return albumRepository.findById(album_id).orElseThrow(() -> new EntityNotFoundException("Album Not Found"));
    }

    public List<Album> findAlbumsByArtistId(Long artist_id) {
        return songRepository.findAll().stream()
                .filter(song -> Objects.equals(song.getArtist().getId(), artist_id))
                .map(Song::getAlbum)
                .distinct()
                .sorted(Comparator.comparing(Album::getReleased_year, Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }

    public List<Album> findAlbumsByArtistName(String artistName) {
        return songRepository.findAll().stream()
                .filter(song -> song.getArtist().getName().equals(artistName))
                .map(Song::getAlbum)
                .distinct()
                .sorted(Comparator.comparing(Album::getReleased_year, Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }

    public Album addAlbum(AlbumRequest request) throws Exception{
        if (!request.getPic_file().isEmpty()){
            String imageUrl = awsS3FileService.uploadToAmazon(request.getPic_file(), "albums/image");
            Album album = Album.builder()
                    .name(request.getAlbum_name())
                    .released_year(request.getAlbum_year())
                    .picturePath(imageUrl)
                    .build();
            return albumRepository.save(album);
        } else {
            throw new IOException("File Is Empty");
        }

    }


}
