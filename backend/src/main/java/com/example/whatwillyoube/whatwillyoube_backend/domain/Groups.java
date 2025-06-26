package com.example.whatwillyoube.whatwillyoube_backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "group_table")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Groups {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String groupName;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @OneToOne(fetch = FetchType.LAZY)
    private Member managerId;

}
