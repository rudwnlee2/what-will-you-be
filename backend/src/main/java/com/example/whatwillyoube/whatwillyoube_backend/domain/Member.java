package com.example.whatwillyoube.whatwillyoube_backend.domain;

import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberRequestDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
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
    private LocalDate birth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String school;

    @Builder
    public Member(String loginId, String password, String name, String email, LocalDate birth, Gender gender, String phone, String school) {
        this.loginId = loginId;
        this.password = password;
        this.name = name;
        this.email = email;
        this.birth = birth;
        this.gender = gender;
        this.phone = phone;
        this.school = school;

    }

    public void update(MemberRequestDto requestDto, PasswordEncoder passwordEncoder) {
        // 비밀번호는 값이 존재할 때만 변경
        if (requestDto.getPassword() != null && !requestDto.getPassword().isBlank()) {
            this.password = passwordEncoder.encode(requestDto.getPassword());
        }
        // DTO의 각 필드가 null이 아닐 경우에만 기존 엔티티의 값을 변경
        if (requestDto.getName() != null) {
            this.name = requestDto.getName();
        }
        if (requestDto.getEmail() != null) {
            this.email = requestDto.getEmail();
        }
        if (requestDto.getBirth() != null) {
            this.birth = requestDto.getBirth();
        }
        if (requestDto.getGender() != null) {
            this.gender = requestDto.getGender();
        }
        if (requestDto.getPhone() != null) {
            this.phone = requestDto.getPhone();
        }
        if (requestDto.getSchool() != null) {
            this.school = requestDto.getSchool();
        }
    }

}
