package com.example.translator.entity.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArtistRequest {
    private String artist_name;
    private String description;
    private MultipartFile pic_file;
}
