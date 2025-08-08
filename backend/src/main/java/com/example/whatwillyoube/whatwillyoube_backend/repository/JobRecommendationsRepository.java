package com.example.whatwillyoube.whatwillyoube_backend.repository;

import com.example.whatwillyoube.whatwillyoube_backend.domain.JobRecommendations;
import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRecommendationsRepository extends JpaRepository<JobRecommendations, Long> {

    List<JobRecommendations> findByMember(Member member);
}
