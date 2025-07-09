package com.example.whatwillyoube.whatwillyoube_backend.controller;

import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.service.MemberService;
import com.example.whatwillyoube.whatwillyoube_backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil; // 로그인 응답 헤더에 토큰을 담기 위해 주

    @PostMapping("/signup")
    public ResponseEntity<MemberResponseDto> signUp(@Valid @RequestBody MemberRequestDto memberRequestDto) {
        // @Valid: MemberRequestDto의 유효성 검증을 실행
        // @RequestBody: 요청 본문(JSON)을 MemberRequestDto 객체로 변환

        MemberResponseDto responseDto = memberService.signUp(memberRequestDto);

        // 성공 시, HTTP 상태 코드 201(Created)과 함께 응답 DTO를 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginRequest, HttpServletResponse response) {
        // Map을 통해 loginId와 password를 받습니다.
        String loginId = loginRequest.get("loginId");
        String password = loginRequest.get("password");

        String token = memberService.login(loginId, password);

        // JWT를 응답 헤더(Authorization)에 추가합니다.
        // "Authorization"은 표준 HTTP 헤더 이름이므로 직접 문자열로 사용해도 안전합니다.
        response.addHeader("Authorization", token);

        return ResponseEntity.ok("로그인 성공");
    }

}
