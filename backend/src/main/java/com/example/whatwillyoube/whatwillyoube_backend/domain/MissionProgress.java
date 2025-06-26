package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class MissionProgress {

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MissionState missionState;

    @Column(nullable = false)
    private LocalDateTime startedDate;

    @Column(nullable = false)
    private LocalDateTime completedDate;

    @MapsId //fk = pk 로 사용하려고
    @OneToOne
    @JoinColumn(name = "missions_id")
    private Missions missions;

}
