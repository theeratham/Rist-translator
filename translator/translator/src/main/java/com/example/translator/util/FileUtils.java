package com.example.translator.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class FileUtils {

    public static File convertMultipartToFile(MultipartFile file) throws IOException {
        File convertedFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
        FileOutputStream fileOutputStream = new FileOutputStream(convertedFile);
        fileOutputStream.write(file.getBytes());
        fileOutputStream.close();
        return convertedFile;
    }

    public static String generateFileName(MultipartFile multipartFile) {
        return new Date().getTime() + "-" + Objects.requireNonNull(multipartFile.getOriginalFilename()).replace(" ", "_");
    }

    public static boolean fileExtensionIsValid(List<String> validExtensions, MultipartFile file) {
        boolean isValid = false;
        for (String ext : validExtensions) {
            if (Objects.requireNonNull(file.getOriginalFilename()).toLowerCase().endsWith("." + ext)) {
                isValid = true;
                break;
            }
        }
        return isValid;
    }

}