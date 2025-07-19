package com.example.whatwillyoube.whatwillyoube_backend.controller;

import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.service.MemberService;
import com.example.whatwillyoube.whatwillyoube_backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/myPage") // GET 요청
    public ResponseEntity<MemberResponseDto> myPage(HttpServletRequest request) { // (1)

        // (2) 경비원(인터셉터)이 붙여준 'memberId'라는 이름의 임시 출입증을 request에서 꺼냅니다.
        Long memberId = (Long) request.getAttribute("memberId");

        // (3) 이제 이 memberId는 100% 신뢰할 수 있는 값이므로, 마음껏 사용합니다.
        MemberResponseDto responseDto = memberService.getMember(memberId);

        return ResponseEntity.ok(responseDto);
    }

    @PatchMapping("/updateMyPage") // HTTP Method: PATCH, URL: /api/members/myPage
    public ResponseEntity<MemberResponseDto> updateMyPage(
            HttpServletRequest request,
            @Valid @RequestBody MemberRequestDto memberRequestDto) {

        // 1. myPage 조회와 똑같이, 인터셉터로부터 신뢰할 수 있는 memberId를 받습니다.
        Long memberId = (Long) request.getAttribute("memberId");

        // 2. 서비스 계층에 memberId와 수정할 데이터를 모두 전달합니다.
        MemberResponseDto responseDto = memberService.updateMember(memberId, memberRequestDto);

        // 3. 성공적으로 수정되었음을 알리는 응답을 반환합니다.
        return ResponseEntity.ok(responseDto);
    }

}

