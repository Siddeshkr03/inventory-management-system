package com.arraybots.formbackend.storage;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController

@RequestMapping("/api/files")

@CrossOrigin(origins = "http://localhost:5173")

public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {

        this.fileStorageService = fileStorageService;

    }

    @PostMapping("/upload")
    public String uploadPdf(

            @RequestParam("files") MultipartFile[] files

    ) {

        return fileStorageService.saveFiles(files);

    }

    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> viewFile(
            @PathVariable String fileName) {

        Resource resource = fileStorageService.loadFiles(fileName);

        String contentType;

        try {
            Path path = resource.getFile().toPath();
            contentType = Files.probeContentType(path);
        } catch (Exception e) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + fileName + "\""
                )
                .body(resource);
    }

}