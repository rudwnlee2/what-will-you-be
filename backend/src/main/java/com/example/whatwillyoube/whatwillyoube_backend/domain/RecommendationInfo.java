package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "recommendation_info")
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
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

}
