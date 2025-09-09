package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.domain.*;
import com.example.whatwillyoube.whatwillyoube_backend.dto.JobRecommendationsResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.PythonApiRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.PythonApiResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.repository.JobRecommendationsRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.RecommendationInfoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RecommendationService 단위 테스트")
class RecommendationServiceTest {

    @Mock
    private JobRecommendationsRepository jobRecommendationsRepository;

    @Mock
    private RecommendationInfoRepository recommendationInfoRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private RestClient restClient;

    @Mock
    private RestClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private RestClient.RequestBodySpec requestBodySpec;

    @Mock
    private RestClient.ResponseSpec responseSpec;

    @InjectMocks
    private RecommendationService recommendationService;

    private Member testMember;
    private RecommendationInfo testRecommendationInfo;
    private PythonApiResponseDto mockApiResponse;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(recommendationService, "pythonApiBaseUrl", "http://127.0.0.1:8000");
        
        testMember = createTestMember();
        testRecommendationInfo = createTestRecommendationInfo(testMember);
        mockApiResponse = createMockApiResponse();
    }
    
    private Member createTestMember() {
        Member member = Member.builder()
                .loginId("testuser")
                .password("password")
                .name("테스트유저")
                .email("test@example.com")
                .birth(LocalDate.of(2000, 1, 1))
                .gender(Gender.MALE)
                .phone("010-1234-5678")
                .school("테스트고등학교")
                .build();
        ReflectionTestUtils.setField(member, "id", 1L);
        return member;
    }
    
    private RecommendationInfo createTestRecommendationInfo(Member member) {
        return RecommendationInfo.builder()
                .member(member)
                .dream("소프트웨어 개발자")
                .interest("프로그래밍, 기술")
                .jobValue(JobValue.STABILITY)
                .mbti(MBTI.INTJ)
                .hobby("코딩, 독서")
                .favoriteSubject("수학, 과학")
                .holland(Holland.INVESTIGATIVE)
                .build();
    }
    
    private PythonApiResponseDto createMockApiResponse() {
        PythonApiResponseDto.RecommendedJobDetail jobDetail = new PythonApiResponseDto.RecommendedJobDetail(
                "백엔드 개발자",
                "서버 시스템 개발",
                "컴퓨터공학 전공 후 실무 경험",
                "컴퓨터공학, 소프트웨어공학",
                "정보처리기사",
                "4000-8000만원",
                "매우 좋음",
                "프로그래밍, 데이터베이스",
                "사무실, 재택근무 가능",
                "창조성, 안정성",
                "INTJ 성향과 프로그래밍 관심사가 일치"
        );
        return new PythonApiResponseDto(List.of(jobDetail), 1L);
    }
    
    private void mockRestClientSuccess() {
        when(restClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.accept(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(PythonApiRequestDto.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.toEntity(PythonApiResponseDto.class)).thenReturn(ResponseEntity.ok(mockApiResponse));
    }
    
    private void mockRestClientFailure(Exception exception) {
        when(restClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.accept(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(PythonApiRequestDto.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.toEntity(PythonApiResponseDto.class)).thenThrow(exception);
    }
    
    private JobRecommendations createSavedRecommendation() {
        JobRecommendations recommendation = JobRecommendations.builder()
                .jobName("백엔드 개발자")
                .jobSum("서버 시스템 개발")
                .way("컴퓨터공학 전공 후 실무 경험")
                .major("컴퓨터공학, 소프트웨어공학")
                .certificate("정보처리기사")
                .pay("4000-8000만원")
                .jobProspect("매우 좋음")
                .knowledge("프로그래밍, 데이터베이스")
                .jobEnvironment("사무실, 재택근무 가능")
                .jobValues("창조성, 안정성")
                .reason("INTJ 성향과 프로그래밍 관심사가 일치")
                .member(testMember)
                .build();
        ReflectionTestUtils.setField(recommendation, "id", 1L);
        ReflectionTestUtils.setField(recommendation, "createdDate", LocalDateTime.now());
        return recommendation;
    }

    @Test
    @DisplayName("직업 추천 생성 성공")
    void generateJobRecommendations_Success() {
        // given
        Long memberId = 1L;
        ArgumentCaptor<PythonApiRequestDto> requestCaptor = ArgumentCaptor.forClass(PythonApiRequestDto.class);
        ArgumentCaptor<List<JobRecommendations>> saveCaptor = ArgumentCaptor.forClass(List.class);
        
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(testMember));
        when(recommendationInfoRepository.findById(memberId)).thenReturn(Optional.of(testRecommendationInfo));
        
        mockRestClientSuccess();
        
        JobRecommendations savedRecommendation = createSavedRecommendation();
        when(jobRecommendationsRepository.saveAll(saveCaptor.capture())).thenReturn(List.of(savedRecommendation));

        // when
        List<JobRecommendationsResponseDto> result = recommendationService.generateJobRecommendations(memberId);

        // then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("백엔드 개발자", result.get(0).getJobName());
        assertEquals("서버 시스템 개발", result.get(0).getJobSummary());

        // ArgumentCaptor를 통한 상세 검증
        verify(requestBodySpec).body(requestCaptor.capture());
        PythonApiRequestDto capturedRequest = requestCaptor.getValue();
        assertEquals(memberId, capturedRequest.getMemberId());
        assertEquals("소프트웨어 개발자", capturedRequest.getDream());
        assertEquals("STABILITY", capturedRequest.getJobValue());
        assertEquals("INTJ", capturedRequest.getMbti());
        assertEquals("INVESTIGATIVE", capturedRequest.getHolland());
        
        List<JobRecommendations> savedRecommendations = saveCaptor.getValue();
        assertEquals(1, savedRecommendations.size());
        JobRecommendations savedRec = savedRecommendations.get(0);
        assertEquals("백엔드 개발자", savedRec.getJobName());
        assertEquals(testMember, savedRec.getMember());

        verify(memberRepository).findById(memberId);
        verify(recommendationInfoRepository).findById(memberId);
    }

    @Test
    @DisplayName("존재하지 않는 회원으로 추천 생성 실패")
    void generateJobRecommendations_MemberNotFound() {
        // given
        Long memberId = 999L;
        when(memberRepository.findById(memberId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> recommendationService.generateJobRecommendations(memberId));
        assertEquals("회원을 찾을 수 없습니다. memberId: " + memberId, exception.getMessage());

        verify(memberRepository).findById(memberId);
        verifyNoInteractions(recommendationInfoRepository);
        verifyNoInteractions(jobRecommendationsRepository);
    }

    @Test
    @DisplayName("추천 정보가 없어서 추천 생성 실패")
    void generateJobRecommendations_RecommendationInfoNotFound() {
        // given
        Long memberId = 1L;
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(testMember));
        when(recommendationInfoRepository.findById(memberId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> recommendationService.generateJobRecommendations(memberId));
        assertEquals("추천 정보를 찾을 수 없습니다. memberId: " + memberId, exception.getMessage());

        verify(memberRepository).findById(memberId);
        verify(recommendationInfoRepository).findById(memberId);
        verifyNoInteractions(jobRecommendationsRepository);
    }

    @Test
    @DisplayName("Python API 호출 실패")
    void generateJobRecommendations_PythonApiCallFailed() {
        // given
        Long memberId = 1L;
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(testMember));
        when(recommendationInfoRepository.findById(memberId)).thenReturn(Optional.of(testRecommendationInfo));

        mockRestClientFailure(new RuntimeException("API 호출 실패"));

        // when & then
        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> recommendationService.generateJobRecommendations(memberId));
        assertTrue(exception.getMessage().contains("Python API 호출 실패"));

        verify(memberRepository).findById(memberId);
        verify(recommendationInfoRepository).findById(memberId);
        verifyNoInteractions(jobRecommendationsRepository);
    }

    @Test
    @DisplayName("Python API 응답이 null인 경우")
    void generateJobRecommendations_NullApiResponse() {
        // given
        Long memberId = 1L;
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(testMember));
        when(recommendationInfoRepository.findById(memberId)).thenReturn(Optional.of(testRecommendationInfo));

        when(restClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.accept(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(PythonApiRequestDto.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.toEntity(PythonApiResponseDto.class)).thenReturn(ResponseEntity.ok(null));

        // when & then
        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> recommendationService.generateJobRecommendations(memberId));
        assertEquals("Python API로부터 유효한 추천 응답을 받지 못했습니다.", exception.getMessage());

        verifyNoInteractions(jobRecommendationsRepository);
    }

    @Test
    @DisplayName("Python API 응답의 추천 목록이 비어있는 경우")
    void generateJobRecommendations_EmptyRecommendations() {
        // given
        Long memberId = 1L;
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(testMember));
        when(recommendationInfoRepository.findById(memberId)).thenReturn(Optional.of(testRecommendationInfo));

        PythonApiResponseDto emptyResponse = new PythonApiResponseDto(List.of(), 1L);

        when(restClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.accept(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(PythonApiRequestDto.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.toEntity(PythonApiResponseDto.class)).thenReturn(ResponseEntity.ok(emptyResponse));

        // when & then
        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> recommendationService.generateJobRecommendations(memberId));
        assertEquals("Python API로부터 유효한 추천 응답을 받지 못했습니다.", exception.getMessage());

        verifyNoInteractions(jobRecommendationsRepository);
    }
}