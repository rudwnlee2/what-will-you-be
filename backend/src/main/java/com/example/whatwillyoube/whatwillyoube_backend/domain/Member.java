package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.Entity;

import java.time.LocalDateTime;

//@Entity
public class Member {

    private Long id;

    private String loginId;
    private String password;
    private String email;
    private LocalDateTime birth;

//    private Gender gender; //Enum 클래스로 만들어야 됨

    private String phone;
    private String school;

    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;


}
