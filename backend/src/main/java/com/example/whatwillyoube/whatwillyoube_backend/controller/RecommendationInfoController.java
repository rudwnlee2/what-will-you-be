package com.example.whatwillyoube.whatwillyoube_backend.controller;

import com.example.whatwillyoube.whatwillyoube_backend.dto.RecommendationInfoRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.RecommendationInfoResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.service.RecommendationInfoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendation-info")
public class RecommendationInfoController {

    private final RecommendationInfoService recommendationInfoService;

    @GetMapping
    public ResponseEntity<RecommendationInfoResponseDto> getMyRecommendationInfo(HttpServletRequest request) {
        Long memberId = (Long) request.getAttribute("memberId");
        RecommendationInfoResponseDto responseDto = recommendationInfoService.getRecommendationInfo(memberId);

        if (responseDto == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping
    public ResponseEntity<RecommendationInfoResponseDto> createOrUpdateMyRecommendationInfo(
            HttpServletRequest request,
            @RequestBody RecommendationInfoRequestDto requestDto) {

        Long memberId = (Long) request.getAttribute("memberId");

        RecommendationInfoResponseDto responseDto = recommendationInfoService.createOrUpdateRecommendationInfo(memberId, requestDto);

        return ResponseEntity.ok(responseDto);
    }

}
