package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class GroupMembers {

    @Id
    private Long groupsId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus invitationStatus;

    @Column(nullable = false)
    private LocalDateTime invitedDate;
    private LocalDateTime respondedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @MapsId //fk = pk 로 사용하려고
    @OneToOne
    @JoinColumn(name = "groups_id")
    private Groups groups;

}
