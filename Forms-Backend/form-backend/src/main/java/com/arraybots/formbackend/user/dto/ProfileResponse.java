package com.arraybots.formbackend.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private String profileImage;
}