package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import com.example.whatwillyoube.whatwillyoube_backend.domain.RecommendationInfo;
import com.example.whatwillyoube.whatwillyoube_backend.dto.RecommendationInfoRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.RecommendationInfoResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import com.example.whatwillyoube.whatwillyoube_backend.repository.RecommendationInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendationInfoService {

    private final RecommendationInfoRepository recommendationInfoRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public RecommendationInfoResponseDto createOrUpdateRecommendationInfo(Long memberId, RecommendationInfoRequestDto requestDto) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

        RecommendationInfo info;

        Optional<RecommendationInfo> infoOptional = recommendationInfoRepository.findById(memberId);

        if (infoOptional.isPresent()) {
            // 이미 존재하면 업데이트
            info = infoOptional.get();
            info.update(requestDto);
        } else {
            // 존재하지 않으면 새로 생성 후 저장
            info = requestDto.toEntity(member);
            recommendationInfoRepository.save(info);
        }

        return new RecommendationInfoResponseDto(info);
    }

    @Transactional(readOnly = true)
    public RecommendationInfoResponseDto getRecommendationInfo(Long memberId) {
        // ID로 RecommendationInfo를 찾고, 존재하면 DTO로 변환하여 반환
        return recommendationInfoRepository.findById(memberId)
                .map(RecommendationInfoResponseDto::new) // 정보가 있으면 이 생성자가 호출됨
                .orElse(new RecommendationInfoResponseDto()); // 정보가 없으면 빈 DTO를 생성하는 생성자가 호출됨
    }

}
