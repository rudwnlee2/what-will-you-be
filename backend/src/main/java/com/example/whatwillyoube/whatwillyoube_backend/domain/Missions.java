package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Missions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MissionType missionType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany
    @JoinColumn(name = "job_recommendations_id")
    private List<Job_Recommendations> jobRecommendations;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "groups_id")
    private Groups groups;

}
