package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "job_recommendations")
public class JobRecommendations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String jobName;

    @Column(nullable = false)
    private String jobSum;

    @Column(nullable = false)
    private String way;

    @Column(nullable = false)
    private String major;

    @Column(nullable = false)
    private String certificate;

    @Column(nullable = false)
    private String pay;

    @Column(nullable = false)
    private String jobProspect;

    @Column(nullable = false)
    private String knowledge;

    @Column(nullable = false)
    private String jobEnvironment;

    @Column(nullable = false)
    private String jobValues;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member Member;

}
