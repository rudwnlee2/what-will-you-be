package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.domain.JobRecommendations;
import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import com.example.whatwillyoube.whatwillyoube_backend.domain.RecommendationInfo;
import com.example.whatwillyoube.whatwillyoube_backend.dto.JobRecommendationsResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.PythonApiRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.PythonApiResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.repository.JobRecommendationsRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.RecommendationInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RecommendationService {

    private final JobRecommendationsRepository jobRecommendationsRepository;
    private final RecommendationInfoRepository recommendationInfoRepository;
    private final MemberRepository memberRepository;
    private final RestClient restClient;
    
    @Value("${api.python.url}")
    private String pythonApiBaseUrl;

    //프론트에서 요청 들어오면 디비에서 추처에 필요한 정보(RecommendationInfoRepository) 조회 후 파이썬 전달
    public List<JobRecommendationsResponseDto> generateJobRecommendations(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다. memberId: " + memberId));

        RecommendationInfo recommendationInfo = recommendationInfoRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("추천 정보를 찾을 수 없습니다. memberId: " + memberId));

        PythonApiRequestDto pythonRequest = new PythonApiRequestDto(
                memberId,
                recommendationInfo.getDream(),
                recommendationInfo.getInterest(),
                recommendationInfo.getJobValue().name(),
                recommendationInfo.getMbti().name(),
                recommendationInfo.getHobby(),
                recommendationInfo.getFavoriteSubject(),
                recommendationInfo.getHolland().name()
        );

        String pythonApiUrl = pythonApiBaseUrl + "/api/recommend/";

        ResponseEntity<PythonApiResponseDto> responseEntity;
        try {
            responseEntity = restClient.post()
                    .uri(pythonApiUrl)
                    .body(pythonRequest)
                    .retrieve()
                    .toEntity(PythonApiResponseDto.class);
        } catch (Exception e) {
            throw new IllegalStateException("Python API 호출 실패: " + e.getMessage());
        }

        PythonApiResponseDto apiResponse = responseEntity.getBody();
        if (apiResponse == null || apiResponse.getRecommendedJobs() == null || apiResponse.getRecommendedJobs().isEmpty()) {
            throw new IllegalStateException("Python API로부터 유효한 추천 응답을 받지 못했습니다.");
        }

        // 새로 받은 추천 결과를 JobRecommendation 엔티티로 변환하여 DB에 저장
        List<JobRecommendations> newRecommendations = apiResponse.getRecommendedJobs().stream()
                .map(jobDetail -> JobRecommendations.builder()
                        .jobName(jobDetail.getJobName())
                        .jobSum(jobDetail.getJobSum())
                        .way(jobDetail.getWay())
                        .major(jobDetail.getMajor())
                        .certificate(jobDetail.getCertificate())
                        .pay(jobDetail.getPay())
                        .jobProspect(jobDetail.getJobProspect())
                        .knowledge(jobDetail.getKnowledge())
                        .jobEnvironment(jobDetail.getJobEnvironment())
                        .jobValues(jobDetail.getJobValues())
                        .reason(jobDetail.getReason())
                        .member(member) // Member와 연결
                        .build())
                .collect(Collectors.toList());

        List<JobRecommendations> savedRecommendations = jobRecommendationsRepository.saveAll(newRecommendations);

        // 저장된 최종 결과를 프론트엔드에 전달할 DTO로 변환
        return savedRecommendations.stream()
                .map(JobRecommendationsResponseDto::fromEntity) // DTO의 정적 팩토리 메서드 사용
                .collect(Collectors.toList());

    }

}
