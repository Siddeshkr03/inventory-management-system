package com.arraybots.formbackend.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Override
    public String saveFiles(MultipartFile[] files) {

        try {

            if (files.length == 0) {
                throw new RuntimeException("No files selected.");
            }

            Path uploadPath = Paths.get("uploads/files");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            List<String> uploadedFileNames = new ArrayList<>();

            for (MultipartFile file : files) {

                if (file.isEmpty()) {
                    continue;
                }

                String originalFileName = file.getOriginalFilename();

                String uniqueFileName =
                        System.currentTimeMillis() + "_" + originalFileName;

                Path filePath = uploadPath.resolve(uniqueFileName);

                file.transferTo(filePath);

                uploadedFileNames.add(uniqueFileName);
            }

            return String.join(",", uploadedFileNames);

        } catch (IOException e) {

            throw new RuntimeException("Error while saving files.", e);

        }

    }
    @Override
    public Resource loadFiles(String fileName) {

        try {

            Path filePath = Paths.get("uploads/files")
                    .resolve(fileName)
                    .normalize();

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            }

            throw new RuntimeException("File not found.");

        } catch (MalformedURLException e) {

            throw new RuntimeException(e);

        }
    }
}