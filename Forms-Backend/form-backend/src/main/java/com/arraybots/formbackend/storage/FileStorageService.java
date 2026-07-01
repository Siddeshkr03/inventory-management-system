package com.arraybots.formbackend.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String savePdf(MultipartFile file);

}