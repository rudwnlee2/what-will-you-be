package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Gender;
import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import com.example.whatwillyoube.whatwillyoube_backend.domain.RecommendationInfo;
import com.example.whatwillyoube.whatwillyoube_backend.dto.RecommendationInfoRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.RecommendationInfoResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.RecommendationInfoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RecommendationInfoService 단위 테스트")
public class RecommendationInfoServiceTest {

    @Mock
    private RecommendationInfoRepository recommendationInfoRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RecommendationInfoService recommendationInfoService;

    private Member testMember;
    private RecommendationInfo testRecommendationInfo;
    private RecommendationInfoRequestDto requestDto;

    @BeforeEach
    void setUp() {
        testMember = Member.builder()
                .loginId("testuser")
                .password("Password!1")
                .name("테스트유저")
                .email("test@test.com")
                .birth(LocalDate.of(2000, 1, 1))
                .gender(Gender.MALE)
                .phone("010-0000-0000")
                .school("테스트학교")
                .build();
        org.springframework.test.util.ReflectionTestUtils.setField(testMember, "id", 1L);

        requestDto = RecommendationInfoRequestDto.builder()
                .dream("소프트웨어 아키텍트")
                .interest("시스템 설계")
                .build();

        testRecommendationInfo = RecommendationInfo.builder()
                .member(testMember)
                .dream("기존 꿈")
                .interest("기존 관심사")
                .build();
    }

    @Test
    @DisplayName("추천 정보 생성 성공 (기존 정보가 없을 경우)")
    void createRecommendationInfo_WhenInfoNotExists() {
        // given
        when(memberRepository.findById(1L)).thenReturn(Optional.of(testMember));
        when(recommendationInfoRepository.findByMemberId(1L)).thenReturn(Optional.empty());
        when(recommendationInfoRepository.save(any(RecommendationInfo.class)))
                .thenAnswer(invocation -> invocation.getArgument(0)); // 저장된 객체 그대로 반환

        // when
        RecommendationInfoResponseDto responseDto =
                recommendationInfoService.createOrUpdateRecommendationInfo(1L, requestDto);

        // then
        assertNotNull(responseDto);
        assertEquals(requestDto.getDream(), responseDto.getDream());
        assertEquals(requestDto.getInterest(), responseDto.getInterest());

        verify(recommendationInfoRepository, times(1)).save(any(RecommendationInfo.class));
    }

    @Test
    @DisplayName("추천 정보 수정 성공 (기존 정보가 있을 경우)")
    void updateRecommendationInfo_WhenInfoExists() {
        // given
        when(memberRepository.findById(1L)).thenReturn(Optional.of(testMember));
        when(recommendationInfoRepository.findByMemberId(1L)).thenReturn(Optional.of(testRecommendationInfo));

        // when
        RecommendationInfoResponseDto responseDto =
                recommendationInfoService.createOrUpdateRecommendationInfo(1L, requestDto);

        // then
        assertNotNull(responseDto);
        assertEquals(requestDto.getDream(), responseDto.getDream());
        assertEquals(requestDto.getInterest(), responseDto.getInterest());

        verify(recommendationInfoRepository, never()).save(any(RecommendationInfo.class));
    }

    @Test
    @DisplayName("추천 정보 생성/수정 실패 - 존재하지 않는 회원")
    void createOrUpdate_Fail_MemberNotFound() {
        // given
        when(memberRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            recommendationInfoService.createOrUpdateRecommendationInfo(999L, requestDto);
        });
        assertEquals("존재하지 않는 회원입니다.", exception.getMessage());

        verifyNoInteractions(recommendationInfoRepository);
    }

    @Test
    @DisplayName("추천 정보 조회 성공")
    void getRecommendationInfo_Success() {
        // given
        when(recommendationInfoRepository.findByMemberId(1L)).thenReturn(Optional.of(testRecommendationInfo));

        // when
        RecommendationInfoResponseDto responseDto =
                recommendationInfoService.getRecommendationInfo(1L);

        // then
        assertNotNull(responseDto);
        assertEquals(testRecommendationInfo.getDream(), responseDto.getDream());
    }

    @Test
    @DisplayName("추천 정보 조회 - 정보가 없을 경우 빈 DTO 반환")
    void getRecommendationInfo_ReturnsEmptyDto_WhenInfoNotExists() {
        // given
        when(recommendationInfoRepository.findByMemberId(1L)).thenReturn(Optional.empty());

        // when
        RecommendationInfoResponseDto responseDto =
                recommendationInfoService.getRecommendationInfo(1L);

        // then
        assertNotNull(responseDto);
        assertEquals("", responseDto.getDream());
        assertEquals("", responseDto.getInterest());
        assertNull(responseDto.getJobValue());
        assertNull(responseDto.getMbti());
    }
}
