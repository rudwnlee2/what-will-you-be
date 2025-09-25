package com.example.whatwillyoube.whatwillyoube_backend.controller;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Gender;
import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import com.example.whatwillyoube.whatwillyoube_backend.repository.JobRecommendationsRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class JobRecommendationsControllerTest {

    @Autowired
    JobRecommendationsRepository jobRecommendationsRepository;

    @Autowired
    MemberRepository memberRepository;

    void saveMember() {
        Member member = Member.builder()
                .loginId("test123")
                .password("qwe123!@#")
                .name("tesst")
                .email("test@test.com")
                .birth(LocalDate.of(2001, 1, 31))
                .gender(Gender.MALE)
                .phone("010-1234-5678")
                .school("한신대학교").build();

        memberRepository.save(member);
    }

//    void login

    @LocalServerPort
    int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        memberRepository.deleteAll();
        jobRecommendationsRepository.deleteAll();
    }

    @Test
    @DisplayName("추천에 필요한 정보 저장 성공")
    void createJobRecommendations_success() {
        
    }

}