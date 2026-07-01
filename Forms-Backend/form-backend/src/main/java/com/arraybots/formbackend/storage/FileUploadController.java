package com.arraybots.formbackend.storage;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

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

            @RequestParam("pdfFile") MultipartFile pdfFile

    ) {

        return fileStorageService.savePdf(pdfFile);

    }

    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> viewPdf(
            @PathVariable String fileName
    ) {

        Resource resource = fileStorageService.loadPdf(fileName);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + fileName + "\""
                )
                .body(resource);

    }

}