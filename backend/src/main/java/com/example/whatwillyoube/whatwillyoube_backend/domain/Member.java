package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Member extends BaseTimeEntity{ // BaseTimeEntity 상속

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

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

    @Builder
    public Member(String loginId, String password, String name, String email, LocalDateTime birth, Gender gender, String phone, String school) {
        this.loginId = loginId;
        this.password = password;
        this.name = name;
        this.email = email;
        this.birth = birth;
        this.gender = gender;
        this.phone = phone;
        this.school = school;

    }

}
