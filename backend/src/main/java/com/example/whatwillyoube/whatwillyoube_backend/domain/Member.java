package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
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

    @OneToOne(
            mappedBy = "member", //RecommendationInfo 에 있는 member 가 연관관계 주인
            cascade = CascadeType.ALL, //Member 저장/삭제 시 Info도 같이 처리됨
            orphanRemoval = true, //관계 끊기면 Info는 자동 삭제됨
            fetch = FetchType.LAZY //Member만 조회할 때 Info는 조회되지 않음 (성능 이점)
    )
    private RecommendationInfo recommendationInfo;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Missions> missions = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Job_Recommendations> jobRecommendations = new ArrayList<>();

    @OneToMany(mappedBy = "fromMember", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friend> sentFriendRequests = new ArrayList<>();

    @OneToMany(mappedBy = "toMember", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friend> receivedFriendRequests = new ArrayList<>();

}
