package com.example.whatwillyoube.whatwillyoube_backend.repository;

import com.example.whatwillyoube.whatwillyoube_backend.domain.RecommendationInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecommendationInfoRepository extends JpaRepository<RecommendationInfo, Long> {
    Optional<RecommendationInfo> findByMemberId(Long memberId);

}
