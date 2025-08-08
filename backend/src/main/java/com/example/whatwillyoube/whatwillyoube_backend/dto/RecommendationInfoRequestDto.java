package com.example.whatwillyoube.whatwillyoube_backend.dto;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Holland;
import com.example.whatwillyoube.whatwillyoube_backend.domain.JobValue;
import com.example.whatwillyoube.whatwillyoube_backend.domain.MBTI;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
public class RecommendationInfoRequestDto {

    private Long memberId;

    private String dream;
    private String dreamReason;
    private String interest;

    private JobValue jobValue;

    private MBTI mbti;

    private String hobby;
    private String favoriteSubject;

    private Holland holland;

    // Builder를 위한 생성자
    public RecommendationInfoRequestDto(Long memberId, String dream, String dreamReason, String interest,
                                       JobValue jobValue, MBTI mbti, String hobby, 
                                       String favoriteSubject, Holland holland) {
        this.memberId = memberId;
        this.dream = dream;
        this.dreamReason = dreamReason;
        this.interest = interest;
        this.jobValue = jobValue;
        this.mbti = mbti;
        this.hobby = hobby;
        this.favoriteSubject = favoriteSubject;
        this.holland = holland;
    }
}
