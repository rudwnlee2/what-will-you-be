package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Job_Recommendations {

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

}
