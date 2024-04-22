package com.example.translator.service;

import com.example.translator.exception.InvalidFileExtensionException;
import com.example.translator.util.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class AwsS3FileService {
    @Autowired
    AwsClientService awsClientService;

    public String uploadToAmazon(MultipartFile multipartFile, String folderName) throws Exception {

        // Valid extensions array, like jpeg/jpg and png.
        List<String> validExtensions = Arrays.asList("jpeg", "jpg", "png", "txt", "mp3", "wav");
        List<String> validFolderName = Arrays.asList("albums/image", "artists/image", "lyrics/lyric", "songs/image", "songs/song");
        String filePath;

        if (!validFolderName.contains(folderName)) {
            throw new Exception("Invalid Folder name to upload to");
        }

        if (!FileUtils.fileExtensionIsValid(validExtensions, multipartFile)) {
            throw new InvalidFileExtensionException(validExtensions);
        } else {
            try {
                filePath = folderName + "/" + FileUtils.generateFileName(multipartFile);
                File tempFile = FileUtils.convertMultipartToFile(multipartFile);
                awsClientService.getClient().putObject(
                        awsClientService.getBucketName(),
                        filePath,
                        tempFile
                );
                boolean deleteResult = tempFile.delete();
                if (!deleteResult) {
                    System.out.println("Deleting " + tempFile.getName() + " Failed!");
                }
            } catch (IOException ioException) {
                throw ioException;
            }
        }
        return awsClientService.getUrl() + filePath;
    }
}