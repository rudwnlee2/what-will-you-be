package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.repository.JobRecommendationsRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.RecommendationInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final JobRecommendationsRepository jobRecommendationsRepository;
    private final RecommendationInfoRepository recommendationInfoRepository;

    

}
