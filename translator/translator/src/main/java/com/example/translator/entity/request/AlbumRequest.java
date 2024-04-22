package com.example.translator.entity.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.lang.management.MemoryUsage;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlbumRequest {
    private String album_name;
    private String album_year;
    private MultipartFile pic_file;
}
