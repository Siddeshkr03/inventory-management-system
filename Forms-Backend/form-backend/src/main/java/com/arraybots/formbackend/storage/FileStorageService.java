package com.arraybots.formbackend.storage;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

public interface FileStorageService {

    String saveFiles(MultipartFile[] file);

    Resource loadFiles(String fileName);

    String saveProfilePhoto(MultipartFile file);

}