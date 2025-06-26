package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class RecommendationInfo {

    @Id
    private Long memberId;

    private String dream;
    private String dreamReason;
    private String interest;

    @Enumerated(EnumType.STRING)
    private JobValue jobValue;

    @Enumerated(EnumType.STRING)
    private MBTI mbti;

    private String hobby;
    private String favoriteSubject;

    @Enumerated(EnumType.STRING)
    private Holland holland;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Column(nullable = false)
    private LocalDateTime lastModifiedDate;

    @MapsId //fk = pk 로 사용하려고
    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;

}
