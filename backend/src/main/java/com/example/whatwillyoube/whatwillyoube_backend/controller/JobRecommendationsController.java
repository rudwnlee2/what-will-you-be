package com.example.whatwillyoube.whatwillyoube_backend.controller;

import com.example.whatwillyoube.whatwillyoube_backend.dto.JobRecommendationsListDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.JobRecommendationsResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.service.JobRecommendationsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/job-recommendations")
public class JobRecommendationsController {

    private final JobRecommendationsService jobRecommendationsService;

    @GetMapping
    public ResponseEntity<List<JobRecommendationsListDto>> getMyRecommendationsList(HttpServletRequest request) {
        Long memberId = (Long) request.getAttribute("memberId");
        List<JobRecommendationsListDto> responseDtoList = jobRecommendationsService.getJobRecommendationsList(memberId);

        return ResponseEntity.ok(responseDtoList);
    }

    /**
     * 내 직업 추천 기록 상세 조회 API
     * @param recommendationId 경로 변수로 받을 추천 기록의 ID
     */
    @GetMapping("/{recommendationId}")
    public ResponseEntity<JobRecommendationsResponseDto> getDetailRecommendation(
            HttpServletRequest request,
            @PathVariable Long recommendationId) { // URL 경로의 {recommendationId} 값을 파라미터로 받습니다.

        Long memberId = (Long) request.getAttribute("memberId");

        JobRecommendationsResponseDto responseDto = jobRecommendationsService.getJobRecommendationDetail(memberId, recommendationId);

        return ResponseEntity.ok(responseDto);
    }

    /**
     * 내 직업 추천 기록 삭제 API
     * @param recommendationId 경로 변수로 받을 추천 기록의 ID
     */
    @DeleteMapping("/{recommendationId}")
    public ResponseEntity<Void> deleteJobRecommendation(
            HttpServletRequest request,
            @PathVariable Long recommendationId) { // URL 경로의 {recommendationId} 값을 파라미터로 받습니다.

        Long memberId = (Long) request.getAttribute("memberId");

        jobRecommendationsService.deleteJobRecommendation(memberId, recommendationId);

        return ResponseEntity.ok().build();
    }


}
