package com.arraybots.formbackend.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ProfileUpdateRequest {

    private String fullName;

    private String email;
}