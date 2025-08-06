package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.domain.*;
import com.example.whatwillyoube.whatwillyoube_backend.dto.RecommendationInfoRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.RecommendationInfoResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.RecommendationInfoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@DisplayName("RecommendationInfoService 테스트")
class RecommendationInfoServiceTest {

    @Autowired
    private RecommendationInfoService recommendationInfoService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RecommendationInfoRepository recommendationInfoRepository;

    private Member testMember;
    private RecommendationInfoRequestDto validRequestDto;

    @BeforeEach
    void setUp() {
        recommendationInfoRepository.deleteAll();
        memberRepository.deleteAll();

        testMember = Member.builder()
                .loginId("testuser")
                .password("password123")
                .name("테스트유저")
                .email("test@example.com")
                .birth(LocalDate.of(2000, 1, 1))
                .gender(Gender.MALE)
                .phone("010-1234-5678")
                .school("테스트고등학교")
                .build();
        testMember = memberRepository.save(testMember);

        validRequestDto = createRecommendationInfoRequestDto();
    }

    private RecommendationInfoRequestDto createRecommendationInfoRequestDto() {
        return RecommendationInfoRequestDto.builder()
                .dream("소프트웨어 개발자")
                .dreamReason("프로그래밍이 재미있어서")
                .interest("컴퓨터, 게임")
                .hobby("코딩, 독서")
                .favoriteSubject("수학, 과학")
                .mbti(MBTI.INTJ)
                .holland(Holland.INVESTIGATIVE)
                .jobValue(JobValue.STABILITY)
                .build();
    }

    @Test
    @DisplayName("추천 정보 최초 생성 성공")
    void createRecommendationInfo_Success() {
        // when
        RecommendationInfoResponseDto result = recommendationInfoService
                .createOrUpdateRecommendationInfo(testMember.getId(), validRequestDto);

        // then
        assertNotNull(result);
        assertEquals("소프트웨어 개발자", result.getDream());
        assertEquals("프로그래밍이 재미있어서", result.getDreamReason());
        assertEquals("컴퓨터, 게임", result.getInterest());
        assertEquals(MBTI.INTJ, result.getMbti());
        assertEquals(Holland.INVESTIGATIVE, result.getHolland());
        assertEquals(JobValue.STABILITY, result.getJobValue());
    }

    @Test
    @DisplayName("추천 정보 수정 성공")
    void updateRecommendationInfo_Success() {
        // given - 먼저 추천 정보 생성
        recommendationInfoService.createOrUpdateRecommendationInfo(testMember.getId(), validRequestDto);

        // 수정할 데이터 준비
        RecommendationInfoRequestDto updateDto = RecommendationInfoRequestDto.builder()
                .dream("데이터 사이언티스트")
                .dreamReason("데이터 분석이 흥미로워서")
                .interest("AI, 머신러닝")
                .hobby("데이터 분석, 통계")
                .favoriteSubject("수학, 통계학")
                .mbti(MBTI.ENFP)
                .holland(Holland.ARTISTIC)
                .jobValue(JobValue.CHALLENGE)
                .build();

        // when
        RecommendationInfoResponseDto result = recommendationInfoService
                .createOrUpdateRecommendationInfo(testMember.getId(), updateDto);

        // then
        assertEquals("데이터 사이언티스트", result.getDream());
        assertEquals("데이터 분석이 흥미로워서", result.getDreamReason());
        assertEquals("AI, 머신러닝", result.getInterest());
        assertEquals(MBTI.ENFP, result.getMbti());
        assertEquals(Holland.ARTISTIC, result.getHolland());
        assertEquals(JobValue.CHALLENGE, result.getJobValue());
    }

    @Test
    @DisplayName("존재하지 않는 회원으로 추천 정보 생성 실패")
    void createRecommendationInfo_MemberNotFound() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> recommendationInfoService.createOrUpdateRecommendationInfo(999L, validRequestDto));
        assertEquals("존재하지 않는 회원입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("추천 정보 조회 성공")
    void getRecommendationInfo_Success() {
        // given
        recommendationInfoService.createOrUpdateRecommendationInfo(testMember.getId(), validRequestDto);

        // when
        RecommendationInfoResponseDto result = recommendationInfoService
                .getRecommendationInfo(testMember.getId());

        // then
        assertNotNull(result);
        assertEquals("소프트웨어 개발자", result.getDream());
        assertEquals("프로그래밍이 재미있어서", result.getDreamReason());
    }

    @Test
    @DisplayName("추천 정보가 없는 경우 빈 DTO 반환")
    void getRecommendationInfo_NotFound() {
        // when
        RecommendationInfoResponseDto result = recommendationInfoService
                .getRecommendationInfo(testMember.getId());

        // then
        assertNotNull(result);
        assertEquals("", result.getDream());
        assertEquals("", result.getDreamReason());
        assertEquals("", result.getInterest());
    }

    @Test
    @DisplayName("null 값이 포함된 요청으로 추천 정보 생성")
    void createRecommendationInfo_WithNullValues() {
        // given
        RecommendationInfoRequestDto requestWithNulls = RecommendationInfoRequestDto.builder()
                .dream("개발자")
                .dreamReason(null)
                .interest("프로그래밍")
                .hobby(null)
                .favoriteSubject("수학")
                .mbti(MBTI.INTJ)
                .holland(null)
                .jobValue(JobValue.STABILITY)
                .build();

        // when
        RecommendationInfoResponseDto result = recommendationInfoService
                .createOrUpdateRecommendationInfo(testMember.getId(), requestWithNulls);

        // then
        assertNotNull(result);
        assertEquals("개발자", result.getDream());
        assertNull(result.getDreamReason());
        assertEquals("프로그래밍", result.getInterest());
        assertNull(result.getHobby());
        assertEquals("수학", result.getFavoriteSubject());
        assertEquals(MBTI.INTJ, result.getMbti());
        assertNull(result.getHolland());
        assertEquals(JobValue.STABILITY, result.getJobValue());
    }
}