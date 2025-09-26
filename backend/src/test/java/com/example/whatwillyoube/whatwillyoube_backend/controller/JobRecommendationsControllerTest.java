package com.example.whatwillyoube.whatwillyoube_backend.controller;

import com.example.whatwillyoube.whatwillyoube_backend.domain.*;
import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.RecommendationInfoRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.repository.JobRecommendationsRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.RecommendationInfoRepository;
import com.example.whatwillyoube.whatwillyoube_backend.util.JwtUtil;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class JobRecommendationsControllerTest {

    @Autowired
    private JobRecommendationsRepository jobRecommendationsRepository;

    @Autowired
    private RecommendationInfoRepository recommendationInfoRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private Member member;
    private String token;

    @LocalServerPort
    int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        jobRecommendationsRepository.deleteAll();
        recommendationInfoRepository.deleteAll();
        memberRepository.deleteAll();

        // 회원 생성
        MemberRequestDto memberRequestDto = new MemberRequestDto(
                "testId",
                "Password!1",
                "테스터",
                "test@test.com",
                LocalDate.of(2000, 1, 1),
                Gender.MALE,
                "010-1234-5678",
                "테스트학교"
        );

        member = memberRepository.saveAndFlush(memberRequestDto.toEntity(passwordEncoder));

        // 토큰 생성
        token = jwtUtil.createToken(member.getEmail(), member.getName());

        RecommendationInfoRequestDto recommendationInfoRequestDto = new RecommendationInfoRequestDto(
                member.getId(),
                "개발자",
                "코딩을 좋아해서",
                "IT",
                JobValue.STABILITY,
                MBTI.ISTJ,
                "프로그래밍",
                "수학",
                Holland.INVESTIGATIVE
        );

        recommendationInfoRepository.saveAndFlush(RecommendationInfo.builder()
                .member(member)
                .dream(recommendationInfoRequestDto.getDream())
                .dreamReason(recommendationInfoRequestDto.getDreamReason())
                .interest(recommendationInfoRequestDto.getInterest())
                .jobValue(recommendationInfoRequestDto.getJobValue())
                .mbti(recommendationInfoRequestDto.getMbti())
                .interest(recommendationInfoRequestDto.getInterest())
                .holland(recommendationInfoRequestDto.getHolland())
                .build());

    }

    @Test
    @DisplayName("추천에 필요한 정보 저장 성공")
    void createJobRecommendations_success() {
        
    }

    @Test
    @DisplayName("추천 정보 리스트 조회 성공")
    void getMyRecommendationsList_success() {

    }

    @Test
    @DisplayName("내 직업 추천 기록 상세 조회 성공")
    void getDetailRecommendation_success() {

    }

    @Test
    @DisplayName("추천 기록 삭제 성공")
    void deleteJobRecommendation_success() {

    }

}