package com.example.translator.entity.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SongRequest {
    private MultipartFile song_file;
    private MultipartFile pic_file;
    private Long album_id;
    private Long artist_id;
    private Long lyrics_id;
}
