package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Gender;
import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // 테스트 끝나면 DB 롤백됨
@DisplayName("회원가입/로그인 테스트")
class MemberServiceTest {

//    @Autowired
//    private MemberService memberService;
//
//    @Autowired
//    private MemberRepository memberRepository;
//
//    @BeforeEach
//    void setUp() {
//        memberRepository.deleteAll(); // 매 테스트마다 초기화
//    }
//
//    @Test
//    @DisplayName("회원가입 후 로그인 → JWT 토큰 발급")
//    void testJoinAndLogin() {
//        // given: 회원가입용 데이터 준비
//        Member member = new Member(
//                "testid", "1234", "test@example.com",
//                LocalDateTime.of(2000, 1, 1, 0, 0),
//                Gender.MALE, "010-1234-5678", "Sample High School"
//        );
//
//        // when: 회원가입 실행
//        memberService.memberJoin(member);
//
//        // when: 로그인 후 토큰 발급
//        String token = memberService.login("testid", "1234"); // loginId 사용
//
//        // then: 토큰이 잘 생성됐는지 확인
//        assertNotNull(token);
//        assertTrue(token.length() > 20);
//        System.out.println("발급된 토큰: " + token);
//    }
}