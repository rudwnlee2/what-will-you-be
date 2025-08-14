package com.example.whatwillyoube.whatwillyoube_backend.controller;

import com.example.whatwillyoube.whatwillyoube_backend.dto.LoginRequestDto;
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

    @PostMapping("/signup")
    public ResponseEntity<MemberResponseDto> signUp(@Valid @RequestBody MemberRequestDto memberRequestDto) {
        // @Valid: MemberRequestDto의 유효성 검증을 실행
        // @RequestBody: 요청 본문(JSON)을 MemberRequestDto 객체로 변환

        MemberResponseDto responseDto = memberService.signUp(memberRequestDto);

        // 성공 시, HTTP 상태 코드 201(Created)과 함께 응답 DTO를 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDto loginRequest, HttpServletResponse response) {

        String token = memberService.login(loginRequest.getLoginId(), loginRequest.getPassword());
        response.addHeader(JwtUtil.AUTHORIZATION_HEADER, token);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me") // GET 요청
    public ResponseEntity<MemberResponseDto> myPage(HttpServletRequest request) { // (1)

        // (2) 경비원(인터셉터)이 붙여준 'memberId'라는 이름의 임시 출입증을 request에서 꺼냅니다.
        Long memberId = (Long) request.getAttribute("memberId");

        // (3) 이제 이 memberId는 100% 신뢰할 수 있는 값이므로, 마음껏 사용합니다.
        MemberResponseDto responseDto = memberService.getMember(memberId);

        return ResponseEntity.ok(responseDto);
    }

    @PatchMapping("/me") // HTTP Method: PATCH, URL: /api/members/myPage
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

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMember(HttpServletRequest request) {
        Long memberId = (Long) request.getAttribute("memberId");
        memberService.deleteMember(memberId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-username/{loginId}")
    public ResponseEntity<Map<String, Boolean>> checkLoginIdDuplicate(@PathVariable String loginId) {
        boolean exists = memberService.isLoginIdExists(loginId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

}

