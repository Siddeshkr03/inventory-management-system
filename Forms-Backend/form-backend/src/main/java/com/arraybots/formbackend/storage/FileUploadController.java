package com.arraybots.formbackend.storage;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

}