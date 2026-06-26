package com.arraybots.formbackend.supplier.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierDTO {

    private Long id;

    private String supplierName;

    private String phoneNumber;

    private String email;

    private String address;
}