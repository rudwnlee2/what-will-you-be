package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Gender;
import com.example.whatwillyoube.whatwillyoube_backend.domain.JobRecommendations;
import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import com.example.whatwillyoube.whatwillyoube_backend.dto.JobRecommendationsListDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.JobRecommendationsResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.repository.JobRecommendationsRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@DisplayName("JobRecommendationsService 테스트")
class JobRecommendationsServiceTest {

    @Autowired
    private JobRecommendationsService jobRecommendationsService;

    @Autowired
    private JobRecommendationsRepository jobRecommendationsRepository;

    @Autowired
    private MemberRepository memberRepository;

    private Member testMember;
    private Member otherMember;
    private JobRecommendations testRecommendation;

    @BeforeEach
    void setUp() {
        jobRecommendationsRepository.deleteAll();
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

        otherMember = Member.builder()
                .loginId("otheruser")
                .password("password123")
                .name("다른유저")
                .email("other@example.com")
                .birth(LocalDate.of(2000, 1, 1))
                .gender(Gender.FEMALE)
                .phone("010-9876-5432")
                .school("다른고등학교")
                .build();
        otherMember = memberRepository.save(otherMember);

        testRecommendation = createJobRecommendation(testMember, "소프트웨어 개발자", "웹 애플리케이션을 개발하는 직업");
        testRecommendation = jobRecommendationsRepository.save(testRecommendation);
    }

    private JobRecommendations createJobRecommendation(Member member, String jobName, String jobSum) {
        return JobRecommendations.builder()
                .member(member)
                .jobName(jobName)
                .jobSum(jobSum)
                .way("대학 전공 학습")
                .major("컴퓨터공학")
                .certificate("정보처리기사")
                .pay("연봉 4000만원")
                .jobProspect("성장 전망이 밝음")
                .knowledge("Java, Spring, MySQL")
                .jobEnvironment("사무실 근무")
                .jobValues("안정성, 성장성")
                .reason("사용자의 성향과 일치")
                .build();
    }

    @Test
    @DisplayName("직업 추천 목록 조회 성공")
    void getJobRecommendationsList_Success() {
        // given - 추가 추천 정보 생성
        JobRecommendations additionalRecommendation = createJobRecommendation(testMember, "데이터 사이언티스트", "데이터를 분석하는 직업");
        jobRecommendationsRepository.save(additionalRecommendation);

        // when
        Page<JobRecommendationsListDto> result = jobRecommendationsService
                .getJobRecommendationsList(testMember.getId(), 0, 10);

        // then
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());
        
        boolean foundSoftwareDeveloper = result.getContent().stream()
                .anyMatch(dto -> "소프트웨어 개발자".equals(dto.getJobName()));
        boolean foundDataScientist = result.getContent().stream()
                .anyMatch(dto -> "데이터 사이언티스트".equals(dto.getJobName()));
        
        assertTrue(foundSoftwareDeveloper);
        assertTrue(foundDataScientist);
    }

    @Test
    @DisplayName("존재하지 않는 회원의 직업 추천 목록 조회 실패")
    void getJobRecommendationsList_MemberNotFound() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> jobRecommendationsService.getJobRecommendationsList(999L, 0, 10));
        assertEquals("존재하지 않는 회원입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("직업 추천이 없는 회원의 목록 조회")
    void getJobRecommendationsList_EmptyList() {
        // when
        Page<JobRecommendationsListDto> result = jobRecommendationsService
                .getJobRecommendationsList(otherMember.getId(), 0, 10);

        // then
        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
        assertEquals(0, result.getTotalElements());
    }

    @Test
    @DisplayName("직업 추천 상세 조회 성공")
    void getJobRecommendationDetail_Success() {
        // when
        JobRecommendationsResponseDto result = jobRecommendationsService
                .getJobRecommendationDetail(testMember.getId(), testRecommendation.getId());

        // then
        assertNotNull(result);
        assertEquals("소프트웨어 개발자", result.getJobName());
        assertEquals("웹 애플리케이션을 개발하는 직업", result.getJobSummary());
        assertEquals("Java, Spring, MySQL", result.getRequiredKnowledge());
        assertEquals("연봉 4000만원", result.getSalary());
        assertEquals("성장 전망이 밝음", result.getProspect());
        assertEquals("컴퓨터공학", result.getRelatedMajors());
        assertEquals("사무실 근무", result.getEnvironment());
    }

    @Test
    @DisplayName("존재하지 않는 추천 정보 상세 조회 실패")
    void getJobRecommendationDetail_RecommendationNotFound() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> jobRecommendationsService.getJobRecommendationDetail(testMember.getId(), 999L));
        assertEquals("존재하지 않는 추천 정보입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("다른 회원의 추천 정보 상세 조회 권한 없음")
    void getJobRecommendationDetail_NoPermission() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> jobRecommendationsService.getJobRecommendationDetail(otherMember.getId(), testRecommendation.getId()));
        assertEquals("해당 추천 정보를 조회할 권한이 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("직업 추천 삭제 성공")
    void deleteJobRecommendation_Success() {
        // when
        assertDoesNotThrow(() -> jobRecommendationsService
                .deleteJobRecommendation(testMember.getId(), testRecommendation.getId()));

        // then
        assertFalse(jobRecommendationsRepository.existsById(testRecommendation.getId()));
    }

    @Test
    @DisplayName("존재하지 않는 추천 정보 삭제 실패")
    void deleteJobRecommendation_RecommendationNotFound() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> jobRecommendationsService.deleteJobRecommendation(testMember.getId(), 999L));
        assertEquals("존재하지 않는 추천 정보입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("다른 회원의 추천 정보 삭제 권한 없음")
    void deleteJobRecommendation_NoPermission() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> jobRecommendationsService.deleteJobRecommendation(otherMember.getId(), testRecommendation.getId()));
        assertEquals("해당 추천 정보를 삭제할 권한이 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("삭제 후 목록에서 제거 확인")
    void deleteJobRecommendation_VerifyRemovalFromList() {
        // given - 추가 추천 정보 생성
        JobRecommendations additionalRecommendation = createJobRecommendation(testMember, "데이터 사이언티스트", "데이터를 분석하는 직업");
        jobRecommendationsRepository.save(additionalRecommendation);

        // 삭제 전 목록 확인
        Page<JobRecommendationsListDto> beforeDelete = jobRecommendationsService
                .getJobRecommendationsList(testMember.getId(), 0, 10);
        assertEquals(2, beforeDelete.getTotalElements());

        // when - 하나 삭제
        jobRecommendationsService.deleteJobRecommendation(testMember.getId(), testRecommendation.getId());

        // then - 삭제 후 목록 확인
        Page<JobRecommendationsListDto> afterDelete = jobRecommendationsService
                .getJobRecommendationsList(testMember.getId(), 0, 10);
        assertEquals(1, afterDelete.getTotalElements());
        assertEquals("데이터 사이언티스트", afterDelete.getContent().get(0).getJobName());
    }

    @Test
    @DisplayName("페이징 기능 테스트 - 첫 번째 페이지")
    void getJobRecommendationsList_Paging_FirstPage() {
        // given - 5개의 추천 정보 생성
        for (int i = 1; i <= 5; i++) {
            JobRecommendations recommendation = createJobRecommendation(testMember, "직업" + i, "직업 설명" + i);
            jobRecommendationsRepository.save(recommendation);
        }

        // when - 페이지 크기 3으로 첫 번째 페이지 조회
        Page<JobRecommendationsListDto> result = jobRecommendationsService
                .getJobRecommendationsList(testMember.getId(), 0, 3);

        // then
        assertNotNull(result);
        assertEquals(6, result.getTotalElements()); // 기존 1개 + 새로 추가한 5개
        assertEquals(3, result.getContent().size());
        assertEquals(2, result.getTotalPages());
        assertTrue(result.isFirst());
        assertFalse(result.isLast());
    }

    @Test
    @DisplayName("페이징 기능 테스트 - 두 번째 페이지")
    void getJobRecommendationsList_Paging_SecondPage() {
        // given - 5개의 추천 정보 생성
        for (int i = 1; i <= 5; i++) {
            JobRecommendations recommendation = createJobRecommendation(testMember, "직업" + i, "직업 설명" + i);
            jobRecommendationsRepository.save(recommendation);
        }

        // when - 페이지 크기 3으로 두 번째 페이지 조회
        Page<JobRecommendationsListDto> result = jobRecommendationsService
                .getJobRecommendationsList(testMember.getId(), 1, 3);

        // then
        assertNotNull(result);
        assertEquals(6, result.getTotalElements());
        assertEquals(3, result.getContent().size());
        assertEquals(2, result.getTotalPages());
        assertFalse(result.isFirst());
        assertTrue(result.isLast());
    }

    @Test
    @DisplayName("페이징 기능 테스트 - 빈 페이지")
    void getJobRecommendationsList_Paging_EmptyPage() {
        // when - 존재하지 않는 페이지 조회
        Page<JobRecommendationsListDto> result = jobRecommendationsService
                .getJobRecommendationsList(testMember.getId(), 5, 10);

        // then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements()); // 기존 1개
        assertTrue(result.getContent().isEmpty());
        assertEquals(1, result.getTotalPages());
    }

    @Test
    @DisplayName("페이징 기능 테스트 - 정렬 확인 (최신순)")
    void getJobRecommendationsList_Paging_OrderByCreatedDateDesc() throws InterruptedException {
        // given - 시간 간격을 두고 추천 정보 생성
        JobRecommendations first = createJobRecommendation(testMember, "첫번째 직업", "첫번째 설명");
        jobRecommendationsRepository.save(first);
        
        Thread.sleep(100); // 시간 차이를 위한 대기
        
        JobRecommendations second = createJobRecommendation(testMember, "두번째 직업", "두번째 설명");
        jobRecommendationsRepository.save(second);

        // when
        Page<JobRecommendationsListDto> result = jobRecommendationsService
                .getJobRecommendationsList(testMember.getId(), 0, 10);

        // then - 최신순으로 정렬되어야 함
        assertNotNull(result);
        assertEquals(3, result.getTotalElements()); // 기존 1개 + 새로 추가한 2개
        
        List<JobRecommendationsListDto> content = result.getContent();
        assertEquals("두번째 직업", content.get(0).getJobName()); // 가장 최근 것이 첫 번째
    }
}