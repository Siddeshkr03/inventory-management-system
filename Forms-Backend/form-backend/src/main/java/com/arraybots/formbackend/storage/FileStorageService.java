package com.arraybots.formbackend.storage;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

public interface FileStorageService {

    String savePdf(MultipartFile file);

    Resource loadPdf(String fileName);

}