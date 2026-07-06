package com.arraybots.formbackend.user.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginResponse {

    private String token;

    private String message;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            String message) {

        this.token = token;
        this.message = message;

    }

}