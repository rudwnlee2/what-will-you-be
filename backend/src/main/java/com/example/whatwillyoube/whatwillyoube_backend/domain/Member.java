package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Entity
@Table(name = "members")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private LocalDateTime birth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String school;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Column(nullable = false)
    private LocalDateTime lastModifiedDate;

    public Member(String loginId, String password, String email,
                  LocalDateTime birth, Gender gender, String phone, String school) {
        this.loginId = loginId;
        this.password = password;
        this.email = email;
        this.birth = birth;
        this.gender = gender;
        this.phone = phone;
        this.school = school;
        this.createdDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
    }

}
