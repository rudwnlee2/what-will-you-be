package com.example.whatwillyoube.whatwillyoube_backend.dto;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Holland;
import com.example.whatwillyoube.whatwillyoube_backend.domain.JobValue;
import com.example.whatwillyoube.whatwillyoube_backend.domain.MBTI;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
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


}
