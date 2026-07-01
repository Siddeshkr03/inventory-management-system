package com.arraybots.formbackend.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Override
    public String savePdf(MultipartFile file) {

        try {

            if (file.isEmpty()) {

                throw new RuntimeException("PDF file is empty.");

            }

            String originalFileName = file.getOriginalFilename();

            String uniqueFileName =
                    System.currentTimeMillis() + "_" + originalFileName;

            Path uploadPath = Paths.get("uploads/pdfs");

            if (!Files.exists(uploadPath)) {

                Files.createDirectories(uploadPath);

            }

            Path filePath = uploadPath.resolve(uniqueFileName);

            file.transferTo(filePath);

            return uniqueFileName;

        } catch (IOException e) {

            throw new RuntimeException("Error while saving PDF.", e);

        }

    }
}